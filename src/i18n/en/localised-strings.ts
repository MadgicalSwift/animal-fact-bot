export const localised = {
  seeMoreMessage: 'See More Data',
  language_hindi: 'हिन्दी',
  language_english: 'English',
  language_changed: 'Language changed to English',
  welcomeMessage: "Welcome to Animal Fact Bot! 🎉 I can share amazing facts about animals and quiz you on your knowledge. Ready to learn something new? Let’s get started!",
  validText: ['hi', 'Hi', 'HI', 'hI', 'Hello', 'hello', 'hola'],
  selectSubtopic: (topicName: string) =>
  `📜 Great choice! Now pick an animal you’d like to learn about. **${topicName}**:`,
  mainMenu:'Main Menu',
  chooseTopic:"Which category of animals would you like to explore?",
  retakeQuiz:'Retake Quiz',
  testYourself: 'Test Yourself',
  Moreexplanation:'More Explanation',
  viewChallenge:"View Challenges",
  endMessage:"Whenever you're ready to continue, just type 'Hi' to start the bot again. Looking forward to helping you out! 😊",
  explanation: (subtopicName: string, description: string) =>
  `📖 **Explanation of ${subtopicName}:**\n${description}`,
  moreExplanation: (subtopicName: string, description: string) =>
  `📝 More Explanation of **${subtopicName}:**\n**${description}**`,
  difficulty: `🎯 Choose your quiz level to get started!🚀`,
  rightAnswer: (explanation: string) =>
  `🌟 Fantastic! You got it 👍right!\nCheck this out: **${explanation}**`,
  wrongAnswer: (correctAnswer: string, explanation: string) =>
 `👎Not quite right, but you’re learning! 💪\nThe correct answer is: **${correctAnswer}**\nHere’s the explanation: **${explanation}**`,
  score: (score: number, totalQuestions: number, badge:string) =>
  `🌟 Great job! Your score is **${score}** out of **${totalQuestions}**.\n\n💪 Congratulations! You earned ${badge} badge! `,
   
  
};
