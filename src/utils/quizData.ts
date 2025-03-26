export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  quizzes: Quiz[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  estimatedTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
  imageUrl?: string;
}

export const quizCategories: QuizCategory[] = [
  {
    id: 'uiux',
    title: 'UI/UX Design',
    description: 'Test your knowledge of user interface and experience design principles',
    icon: '🎨',
    quizzes: [
      {
        id: 'usability',
        title: 'Usability Principles',
        description: 'Questions related to Nielsen\'s heuristics, accessibility guidelines, and usability best practices',
        questionCount: 10,
        estimatedTime: '15 min',
        difficulty: 'Intermediate',
        questions: [
          {
            id: 'q1',
            text: 'Which of Nielsen\'s heuristics refers to keeping users informed about what is happening?',
            options: [
              { id: 'a', text: 'Match between system and the real world' },
              { id: 'b', text: 'Visibility of system status' },
              { id: 'c', text: 'User control and freedom' },
              { id: 'd', text: 'Recognition rather than recall' }
            ],
            correctOptionId: 'b',
            explanation: 'Visibility of system status is about keeping users informed through appropriate feedback within reasonable time.'
          },
          {
            id: 'q2',
            text: 'What is the primary goal of accessible design?',
            options: [
              { id: 'a', text: 'Making websites visually appealing' },
              { id: 'b', text: 'Ensuring products can be used by people with disabilities' },
              { id: 'c', text: 'Increasing website traffic' },
              { id: 'd', text: 'Reducing development time' }
            ],
            correctOptionId: 'b',
            explanation: 'Accessible design focuses on ensuring that people with disabilities can perceive, understand, navigate, and interact with websites and tools.'
          },
          {
            id: 'q3',
            text: 'Which usability principle emphasizes the importance of preventing errors before they occur?',
            options: [
              { id: 'a', text: 'Error recovery' },
              { id: 'b', text: 'Error prevention' },
              { id: 'c', text: 'Error messaging' },
              { id: 'd', text: 'User forgiveness' }
            ],
            correctOptionId: 'b',
            explanation: 'Error prevention focuses on eliminating error-prone conditions or checking for them and presenting users with a confirmation option before they commit to an action.'
          }
        ]
      }
    ]
  },
  {
    id: 'product',
    title: 'Product Design',
    description: 'Explore challenges related to product strategy, user research, and development',
    icon: '📱',
    quizzes: [
      {
        id: 'strategy',
        title: 'Product Strategy',
        description: 'Questions related to defining product vision, goals, and target audience',
        questionCount: 8,
        estimatedTime: '12 min',
        difficulty: 'Advanced',
        questions: [
          {
            id: 'q1',
            text: 'What is a key component of a product vision statement?',
            options: [
              { id: 'a', text: 'Detailed technical specifications' },
              { id: 'b', text: 'The target customer and their needs' },
              { id: 'c', text: 'Specific development timelines' },
              { id: 'd', text: 'Complete list of product features' }
            ],
            correctOptionId: 'b',
            explanation: 'A product vision statement should clearly identify who the target customer is and what needs the product addresses for them.'
          }
        ]
      }
    ]
  },
  {
    id: 'problem',
    title: 'Problem Solving',
    description: 'Challenge your critical thinking and decision-making abilities',
    icon: '💡',
    quizzes: [
      {
        id: 'logical',
        title: 'Logical Reasoning',
        description: 'Questions that require logical thinking and deduction',
        questionCount: 12,
        estimatedTime: '20 min',
        difficulty: 'Intermediate',
        questions: [
          {
            id: 'q1',
            text: 'In a design thinking workshop, five participants (A, B, C, D, and E) need to present in a specific order. If A must present before B, and C must present after D, how many different possible presentation orders are there?',
            options: [
              { id: 'a', text: '24' },
              { id: 'b', text: '36' },
              { id: 'c', text: '48' },
              { id: 'd', text: '60' }
            ],
            correctOptionId: 'c',
            explanation: 'There are 5! = 120 total orderings. The constraints A before B and C after D each eliminate half of the possibilities, resulting in 120 ÷ 2 ÷ 2 = 30 valid orderings.'
          }
        ]
      }
    ]
  },
  {
    id: 'visual',
    title: 'Visual Design',
    description: 'Test your knowledge of color theory, typography, and composition',
    icon: '✏️',
    quizzes: [
      {
        id: 'typography',
        title: 'Typography Fundamentals',
        description: 'Explore the principles of effective typography in design',
        questionCount: 10,
        estimatedTime: '15 min',
        difficulty: 'Beginner',
        questions: []
      }
    ]
  }
];
