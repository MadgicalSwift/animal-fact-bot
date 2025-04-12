import data from '../../datasource/Animal.json';
import { localised } from '../en/localised-strings';
import _ from 'lodash';

export function createMainTopicButtons(from: string) {
 
  const topics = data.topics.map((topic) => topic.topicName);


  const buttons = topics.map((topicName) => ({
    type: 'solid',
    body: topicName,
    reply: topicName,
  }));

  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localised.chooseTopic,
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}

export function createSubTopicButtons(from: string, topicName: string) {
 
  const topic = data.topics.find((topic) => topic.topicName === topicName);

 
  if (topic && topic.subtopics) {
    const buttons = topic.subtopics.map((subtopic) => ({
      type: 'solid',
      body: subtopic.subtopicName,
      reply: subtopic.subtopicName,
    }));

    return {
      to: from,
      type: 'button',
      button: {
        body: {
          type: 'text',
          text: {
            body: localised.selectSubtopic(topicName),
          },
        },
        buttons: buttons,
        allow_custom_response: false,
      },
    };
  } else {
    
    return null;
  }
}

export function createButtonWithExplanation(
  from: string,
  description: string,
  subtopicName: string,
) {
  const buttons = [
    {
      type: 'solid',
      body: 'More Explanation',
      reply: 'More Explanation',
    },
    {
      type: 'solid',
      body: 'Start Quiz',
      reply: 'Start Quiz',
    },
    {
      type: 'solid',
      body: 'Main Menu',
      reply: 'Main Menu',
    },
  ];
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localised.explanation(subtopicName, description),
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}
export function createTestYourSelfButton(
  from: string,
  description: string,
  subtopicName: string,
) {
  const buttons = [
    {
      type: 'solid',
      body: 'Start Quiz',
      reply: 'Start Quiz',
    },
    {
      type: 'solid',
      body: 'Main Menu',
      reply: 'Main Menu',
    },
  ];
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localised.moreExplanation(subtopicName, description),
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}
export function createDifficultyButtons(from: string) {
  const buttons = [
    {
      type: 'solid',
      body: 'Easy',
      reply: 'Easy',
    },
    {
      type: 'solid',
      body: 'Medium',
      reply: 'Medium',
    },
    {
      type: 'solid',
      body: 'Hard',
      reply: 'Hard',
    },
  ];
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: localised.difficulty,
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}

export function questionButton(
  from: string,
  selectedMainTopic: string,
  selectedSubtopic: string,

) {
  const topic = data.topics.find(
    (topic) => topic.topicName === selectedMainTopic,
  );
  if (!topic) {
    
  }

  const subtopic = topic.subtopics.find(
    (subtopic) => subtopic.subtopicName == selectedSubtopic,
  );
  if (!subtopic) {
    
  }

  const questionSets = subtopic.questionSets;
  if (questionSets.length === 0) {
   
    return;
  }


  const questionSet = _.sample(questionSets);
  if (!questionSet) {
    
    return;
  }

  const randomSet = questionSet.setNumber;
  const question = questionSet.questions[0];

  const shuffledOptions = _.shuffle(question.options);
  const buttons = shuffledOptions.map((option: string) => ({
    type: 'solid',
    body: option,
    reply: option,
  }));

  const messageData = {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: question.question,
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };

  return { messageData, randomSet };
}

export function answerFeedback(
  from: string,
  answer: string,
  selectedMainTopic: string,
  selectedSubtopic: string,
  randomSet: string,
  currentQuestionIndex: number,
) {
  const topic = data.topics.find((t) => t.topicName === selectedMainTopic);
  if (!topic) {
    
  }

  const subtopic = topic.subtopics.find(
    (st) => st.subtopicName === selectedSubtopic,
  );
  if (!subtopic) {
    
  }



  const questionSet = subtopic.questionSets.find(
    (qs) =>
      qs.setNumber === parseInt(randomSet),
  );
 
  if (!questionSet) {
   
  }

  const question = questionSet.questions[currentQuestionIndex];
  

 
  const explanation = question.explanation;
  if (!explanation) {
    
  }

  if (!question.answer) {
    
  }
  const correctAnswer = question.answer;
  const userAnswer = Array.isArray(answer) ? answer[0] : answer;
  const correctAns = Array.isArray(correctAnswer) ? correctAnswer[0] : correctAnswer;
  
  const isCorrect = userAnswer === correctAns;
  const feedbackMessage =
    isCorrect
      ? localised.rightAnswer(explanation)
      : localised.wrongAnswer(correctAns, explanation);
  const result = isCorrect ? 1 : 0;

  return { feedbackMessage, result };
}

export function buttonWithScore(
  from: string,
  score: number,
  totalQuestions: number,
  badge:string
) {
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
         
          body: "congrats! you have completed the quiz"
        },
      },
      buttons: [
        {
          type: 'solid',
          body: 'Main Menu',
          reply: 'Main Menu',
        },
        {
          type: 'solid',
          body: 'Retake Quiz',
          reply: 'Retake Quiz',
        },
        {
          type: 'solid',
          body: 'View Challenges',
          reply: 'View Challenges',
        }
      ],
      allow_custom_response: false,
    },
  };
}
export function optionButton(
  from: string,
  selectedMainTopic: string,
  selectedSubtopic: string,
  randomSet: string,
  currentQuestionIndex: number,
) {

  const topic = data.topics.find(
    (topic) => topic.topicName === selectedMainTopic,
  );
  if (!topic) {
    
    
    return;
  }

 
  const subtopic = topic.subtopics.find(
    (subtopic) => subtopic.subtopicName === selectedSubtopic,
  );
  if (!subtopic) {
    
    
    return;
  }


  const questionSet = subtopic.questionSets.find(
    (set) =>
       set.setNumber === parseInt(randomSet),
  );
  if (!questionSet) {
    
    return;
  }


  if (
    currentQuestionIndex < 0 ||
    currentQuestionIndex >= questionSet.questions.length
  ) {
    
    return;
  }


  const question = questionSet.questions[currentQuestionIndex];
  const shuffledOptions = _.shuffle(question.options);

  const buttons = shuffledOptions.map((option: string) => ({
    type: 'solid',
    body: option,
    reply: option,
  }));
  return {
    to: from,
    type: 'button',
    button: {
      body: {
        type: 'text',
        text: {
          body: question.question,
        },
      },
      buttons: buttons,
      allow_custom_response: false,
    },
  };
}
