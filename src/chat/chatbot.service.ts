import { Injectable } from '@nestjs/common';
import IntentClassifier from '../intent/intent.classifier';
import { MessageService } from 'src/message/message.service';
import { UserService } from 'src/model/user.service';
import { localised } from 'src/i18n/en/localised-strings';
import data from '../datasource/Animal.json';
import { SwiftchatMessageService } from 'src/swiftchat/swiftchat.service';
import { plainToClass } from 'class-transformer';
import { User } from 'src/model/user.entity';
import { MixpanelService } from 'src/mixpanel/mixpanel.service';



@Injectable()
export class ChatbotService {
  private apiKey = process.env.API_KEY;
  private apiUrl = process.env.API_URL;
  private botId = process.env.BOT_ID;
  private baseUrl = `${this.apiUrl}/${this.botId}/messages`;

  private readonly intentClassifier: IntentClassifier;
  private readonly message: MessageService;
  private readonly userService: UserService;
  private readonly swiftchatMessageService: SwiftchatMessageService;
  private readonly topics: any[] = data.topics;
  private readonly mixpanel: MixpanelService;

  constructor(
    intentClassifier: IntentClassifier,
    message: MessageService,
    userService: UserService,
    swiftchatMessageService: SwiftchatMessageService,
    mixpanel: MixpanelService,
  ) {
    this.intentClassifier = intentClassifier;
    this.message = message;
    this.swiftchatMessageService = swiftchatMessageService;
    this.userService = userService;
    this.mixpanel = mixpanel;
  }

  public async processMessage(body: any): Promise<any> {
  
    const { from, text, button_response } = body;


    const botID = process.env.BOT_ID;
    let userData = await this.userService.findUserByMobileNumber(from, botID);

   
    if (!userData) {
      await this.userService.createUser(from, 'english', botID);
      userData = await this.userService.findUserByMobileNumber(from, botID);
    }
  
  
    const user = plainToClass(User, userData);

  
    if (button_response) {
      const buttonBody = button_response.body;

     
      const trackingData = {
        distinct_id: from,
        button: buttonBody,
        botID: botID,
      };

      this.mixpanel.track('Button_Click', trackingData);

   
      if (buttonBody === localised.mainMenu) {
        
        user.selectedSet = null;
        user.questionsAnswered = 0;
        user.score = 0;
        await this.userService.saveUser(user);
        await this.message.sendInitialTopics(from);
        return 'ok';
      }
    
      if (buttonBody === localised.retakeQuiz) {
        user.questionsAnswered = 0;
        user.score = 0;
        await this.userService.saveUser(user);
        const selectedMainTopic = user.selectedMainTopic;
        const selectedSubtopic = user.selectedSubtopic;
      
        const randomSet = user.selectedSet;
        await this.message.getQuestionBySet(
          from,
          buttonBody,
          selectedMainTopic,
          selectedSubtopic,
          randomSet,
          user.questionsAnswered,
        );
        return 'ok';
      }
      if(buttonBody=== localised.viewChallenge){
        await this.handleViewChallenges(from, userData);
        await this.message.endMessage(from);
        return 'ok';
      }
    
      if (buttonBody === localised.Moreexplanation) {
        const topic = user.selectedSubtopic;
       
        const subtopic = this.topics
          .flatMap((topic) => topic.subtopics)
          .find((subtopic) => subtopic.subtopicName === topic);
        if (subtopic) {
          const description = subtopic.description;

          await this.message.sendCompleteExplanation(from, description, topic);
        } else {
          
          
        }
        return 'ok';
      }
    

      if (buttonBody === localised.startQuiz) {
        
        user.questionsAnswered=0;
        await this.userService.saveUser(user);

        const selectedMainTopic = user.selectedMainTopic;
        const selectedSubtopic = user.selectedSubtopic;
        
        const { randomSet } = await this.message.sendQuestion(
          from,
          selectedMainTopic,
          selectedSubtopic,
        );

        user.selectedSet = randomSet;
        
        await this.userService.saveUser(user);
        return 'ok';
      }

     
      if ( user.selectedSet) {
        
        const selectedMainTopic = user.selectedMainTopic;
        const selectedSubtopic = user.selectedSubtopic;
      
        const randomSet = user.selectedSet;
        const currentQuestionIndex = user.questionsAnswered;
        const { result } = await this.message.checkAnswer(
          from,
          buttonBody,
          selectedMainTopic,
          selectedSubtopic,
          randomSet,
          currentQuestionIndex,
        );

      
        user.score += result;
        user.questionsAnswered += 1;
        await this.userService.saveUser(user);

        
        if (user.questionsAnswered >= 10) {

          let badge = '';
          if (user.score=== 10) {
            badge = 'Gold 🥇';
          } else if (user.score>= 7) {
            badge = 'Silver 🥈';
          } else if (user.score >= 5) {
            badge = 'Bronze 🥉';
          } else {
            badge = 'Novice 🔰';
          }

        
          const challengeData = {
            topic: selectedMainTopic,
            subTopic:selectedSubtopic,
            question: [
              {
                setNumber: randomSet,
                score: user.score,
                badge: badge,
              },
            ],
          };
         
          await this.userService.saveUserChallenge(
            from,
            userData.Botid,
            challengeData,
          );
         
          await this.message.newscorecard(from,user.score,user.questionsAnswered,badge)
         
          return 'ok';
        }
      
        await this.message.getQuestionBySet(
          from,
          buttonBody,
          selectedMainTopic,
          selectedSubtopic,
          randomSet,
          user.questionsAnswered,
        );

        return 'ok';
      }

     
      const topic = this.topics.find((topic) => topic.topicName === buttonBody);
     
      if (topic) {
        const mainTopic = topic.topicName;

        user.selectedMainTopic = mainTopic;

        await this.userService.saveUser(user);
       

        await this.message.sendSubTopics(from, mainTopic);
      } else {
       
        const subtopic = this.topics
          .flatMap((topic) => topic.subtopics)
          .find((subtopic) => subtopic.subtopicName === buttonBody);
        if (subtopic) {
          const subtopicName = subtopic.subtopicName;
          const description = subtopic.description[0];
          if (!description) {
            
          }

          user.selectedSubtopic = subtopicName;

          await this.userService.saveUser(user);
         
          await this.message.sendExplanation(from, description, subtopicName);
        } else {
          
        }
      }

      return 'ok';
    }

   
    else{
   
      if (localised.validText.includes(text.body)) {
        const userData = await this.userService.findUserByMobileNumber(
          from,
          botID,
        );
        if (!userData) {
          await this.userService.createUser(from, 'English', botID);
        }
  
        user.selectedSet= null;   
        user.selectedMainTopic=null;
        user.selectedSubtopic=null;
        user.score=0; 
        user.questionsAnswered=0;
        await this.userService.saveUser(user);   
       
        if(userData.name==null){
          await this.message.sendWelcomeMessage(from, user.language);
          await this.message.sendName(from);
        }
        else{
          await this.message.sendWelcomeMessage(from, user.language);
          await this.message.sendInitialTopics(from);
        }
      }
      else{

        await this.userService.saveUserName(from, botID, text.body);
        await this.message.sendInitialTopics(from);
      }
       
    }

    return 'ok';
  }
  async handleViewChallenges(from: string, userData: any): Promise<void>{
    try { 
     
      const topStudents = await this.userService.getTopStudents(
        userData.Botid,
        userData.selectedMainTopic,
        userData.selectedSet,
        userData.selectedSubtopic, 
      );
      if (topStudents.length === 0) {
  
        await this.swiftchatMessageService.sendMessage(this.baseUrl,{
          to: from,
          type: 'text',
          text: { body: 'No challenges have been completed yet.' },
        }, this.apiKey);
        return;
      }
    
      let message = 'Top 3 Users:\n\n';
      topStudents.forEach((student, index) => {
        const totalScore = student.score || 0;
        const studentName = student.name || 'Unknown';
      
        let badge = '';
        if (totalScore === 10) {
          badge = 'Gold 🥇';
        } else if (totalScore >= 7) {
          badge = 'Silver 🥈';
        } else if (totalScore >= 5) {
          badge = 'Bronze 🥉';
        } else {
          badge = 'Novice 🔰';
        }

        message += `${index + 1}. ${studentName}\n`;
        message += `    Score: ${totalScore}\n`;
        message += `    Badge: ${badge}\n\n`;
      });

    
      await this.swiftchatMessageService.sendMessage(this.baseUrl,{
        to: from,
        type: 'text',
        text: { body: message },
      }, this.apiKey);
    } catch (error) {
      console.error('Error handling View Challenges:', error);
      await this.swiftchatMessageService.sendMessage(this.baseUrl,{
        to: from,
        type: 'text',
        text: {
          body: 'An error occurred while fetching challenges. Please try again later.',
        },
      }, this.apiKey);
    }
  }

}
export default ChatbotService;


