from app import create_app, db
from models import Quiz

app = create_app()

def seed():
    with app.app_context():
        # Clear existing quizzes
        Quiz.query.delete()
        db.session.commit()
        print("Existing quizzes cleared.")

        quizzes = [
            {
                "id": "quiz-1",
                "title": "Accessibility Fundamentals",
                "description": "Test your knowledge of WCAG principles and basic accessibility concepts.",
                "time_limit": 300,
                "points_reward": 100,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What does the 'POUR' acronym stand for in WCAG?",
                    "options": [
                      { "id": "a", "text": "Perceivable, Operable, Understandable, Robust" },
                      { "id": "b", "text": "Practical, Original, Usable, Reliable" },
                      { "id": "c", "text": "Possible, Organized, Unique, Radiant" },
                      { "id": "d", "text": "Perceivable, Obvious, Useful, Relevant" }
                    ],
                    "correctOptionId": "a",
                    "explanation": "POUR stands for Perceivable, Operable, Understandable, and Robust - the four main principles of web accessibility defined by WCAG."
                  },
                  {
                    "id": "q2",
                    "text": "Which HTML element should be used for main navigation?",
                    "options": [
                      { "id": "a", "text": "<div class='nav'>" },
                      { "id": "b", "text": "<navigation>" },
                      { "id": "c", "text": "<nav>" },
                      { "id": "d", "text": "<section>" }
                    ],
                    "correctOptionId": "c",
                    "explanation": "The <nav> element is the semantic HTML5 element specifically designed for navigation menus, improving accessibility for screen readers."
                  },
                  {
                    "id": "q3",
                    "text": "What is the minimum contrast ratio for normal text (AA level)?",
                    "options": [
                      { "id": "a", "text": "3:1" },
                      { "id": "b", "text": "4.5:1" },
                      { "id": "c", "text": "7:1" },
                      { "id": "d", "text": "2:1" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "WCAG 2.1 Level AA requires a contrast ratio of at least 4.5:1 for normal text to ensure readability for users with visual impairments."
                  }
                ]
            },
            {
                "id": "quiz-2",
                "title": "Work Ethics & Professional Conduct",
                "description": "Learn fundamental principles of workplace ethics, professionalism, and conduct in disability support services.",
                "time_limit": 420,
                "points_reward": 120,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What is the most important principle in disability support work ethics?",
                    "options": [
                      { "id": "a", "text": "Following organizational procedures strictly" },
                      { "id": "b", "text": "Respecting client dignity and autonomy" },
                      { "id": "c", "text": "Completing tasks quickly" },
                      { "id": "d", "text": "Maintaining paperwork accurately" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Respecting client dignity and autonomy is the foundation of ethical disability support work."
                  },
                  {
                    "id": "q2",
                    "text": "What does 'duty of care' mean in disability support?",
                    "options": [
                      { "id": "a", "text": "Working scheduled hours" },
                      { "id": "b", "text": "Legal obligation to ensure client safety and wellbeing" },
                      { "id": "c", "text": "Following supervisor instructions" },
                      { "id": "d", "text": "Reporting to management" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Duty of care is a legal and ethical obligation to ensure the safety and wellbeing of clients."
                  },
                  {
                    "id": "q3",
                    "text": "Which behavior demonstrates professional boundaries?",
                    "options": [
                      { "id": "a", "text": "Accepting expensive gifts from clients" },
                      { "id": "b", "text": "Sharing personal phone numbers with all clients" },
                      { "id": "c", "text": "Maintaining appropriate professional distance while being supportive" },
                      { "id": "d", "text": "Becoming friends with clients on social media" }
                    ],
                    "correctOptionId": "c",
                    "explanation": "Professional boundaries protect both clients and workers while maintaining supportive relationships."
                  },
                  {
                    "id": "q4",
                    "text": "How should confidential client information be handled?",
                    "options": [
                      { "id": "a", "text": "Share with family members if they ask" },
                      { "id": "b", "text": "Only disclose to authorized personnel on a need-to-know basis" },
                      { "id": "c", "text": "Discuss with colleagues in public areas" },
                      { "id": "d", "text": "Post anonymously on forums for advice" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Confidentiality is critical and information should only be shared with authorized personnel."
                  }
                ]
            },
            {
                "id": "quiz-3",
                "title": "Introduction to the Disability Sector",
                "description": "Understand the disability sector landscape, key legislation, and person-centered approaches.",
                "time_limit": 480,
                "points_reward": 150,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What is the social model of disability?",
                    "options": [
                      { "id": "a", "text": "Disability is caused by individual impairments" },
                      { "id": "b", "text": "Disability is created by societal barriers and attitudes" },
                      { "id": "c", "text": "Disability requires medical treatment" },
                      { "id": "d", "text": "Disability is a personal tragedy" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "The social model views disability as created by societal barriers, not personal limitations."
                  },
                  {
                    "id": "q2",
                    "text": "What does NDIS stand for?",
                    "options": [
                      { "id": "a", "text": "National Disability Insurance Scheme" },
                      { "id": "b", "text": "New Disability Integration System" },
                      { "id": "c", "text": "National Development and Inclusion Services" },
                      { "id": "d", "text": "National Disability Information Service" }
                    ],
                    "correctOptionId": "a",
                    "explanation": "NDIS is the National Disability Insurance Scheme providing support for Australians with disability."
                  },
                  {
                    "id": "q3",
                    "text": "What is person-centered practice?",
                    "options": [
                      { "id": "a", "text": "Providing the same support to all clients" },
                      { "id": "b", "text": "Tailoring support based on individual goals, preferences, and needs" },
                      { "id": "c", "text": "Following organizational policies only" },
                      { "id": "d", "text": "Letting clients do everything independently" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Person-centered practice focuses on individual preferences, goals, and needs."
                  },
                  {
                    "id": "q4",
                    "text": "Which act protects people with disabilities from discrimination?",
                    "options": [
                      { "id": "a", "text": "Privacy Act" },
                      { "id": "b", "text": "Disability Discrimination Act" },
                      { "id": "c", "text": "Employment Act" },
                      { "id": "d", "text": "Health Services Act" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "The Disability Discrimination Act protects people with disabilities from discrimination."
                  },
                  {
                    "id": "q5",
                    "text": "What is the key principle of empowerment in disability support?",
                    "options": [
                      { "id": "a", "text": "Making all decisions for the client" },
                      { "id": "b", "text": "Supporting clients to make their own choices and have control over their lives" },
                      { "id": "c", "text": "Protecting clients from all risks" },
                      { "id": "d", "text": "Following what family members want" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Empowerment means supporting people to make their own decisions and have control."
                  }
                ]
            },
            {
                "id": "quiz-4",
                "title": "Communication Skills in Care",
                "description": "Master effective communication techniques for working with people with diverse communication needs.",
                "time_limit": 360,
                "points_reward": 110,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What is active listening?",
                    "options": [
                      { "id": "a", "text": "Waiting for your turn to speak" },
                      { "id": "b", "text": "Fully concentrating, understanding, and responding thoughtfully" },
                      { "id": "c", "text": "Nodding while thinking about other things" },
                      { "id": "d", "text": "Interrupting to show you understand" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Active listening involves full concentration and thoughtful responses."
                  },
                  {
                    "id": "q2",
                    "text": "When supporting someone who uses AAC (Augmentative and Alternative Communication), you should:",
                    "options": [
                      { "id": "a", "text": "Speak faster to save time" },
                      { "id": "b", "text": "Allow sufficient time for them to formulate responses" },
                      { "id": "c", "text": "Finish their sentences to help" },
                      { "id": "d", "text": "Speak to their support person instead" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Patience and allowing time for AAC users to communicate is essential."
                  },
                  {
                    "id": "q3",
                    "text": "What is non-verbal communication?",
                    "options": [
                      { "id": "a", "text": "Only written messages" },
                      { "id": "b", "text": "Body language, facial expressions, gestures, and tone of voice" },
                      { "id": "c", "text": "Sign language only" },
                      { "id": "d", "text": "Silence during conversations" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Non-verbal communication includes body language, expressions, gestures, and tone."
                  },
                  {
                    "id": "q4",
                    "text": "How should you communicate with someone with a cognitive disability?",
                    "options": [
                      { "id": "a", "text": "Speak loudly and slowly" },
                      { "id": "b", "text": "Use simple, clear language and check understanding" },
                      { "id": "c", "text": "Avoid eye contact" },
                      { "id": "d", "text": "Talk to them like a child" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Clear, respectful communication and checking understanding is key."
                  }
                ]
            },
            {
                "id": "quiz-5",
                "title": "Workplace Health & Safety",
                "description": "Essential knowledge about maintaining a safe workplace in disability services.",
                "time_limit": 300,
                "points_reward": 100,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What does WHS stand for?",
                    "options": [
                      { "id": "a", "text": "Work Health Safety" },
                      { "id": "b", "text": "Workplace Hazard System" },
                      { "id": "c", "text": "Worker Help Services" },
                      { "id": "d", "text": "Wellness and Health Standards" }
                    ],
                    "correctOptionId": "a",
                    "explanation": "WHS stands for Work Health Safety, the framework for workplace safety."
                  },
                  {
                    "id": "q2",
                    "text": "What is the first step in manual handling?",
                    "options": [
                      { "id": "a", "text": "Lift as quickly as possible" },
                      { "id": "b", "text": "Assess the task and plan your approach" },
                      { "id": "c", "text": "Bend your back" },
                      { "id": "d", "text": "Lift with straight legs" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Always assess and plan before manual handling to prevent injury."
                  },
                  {
                    "id": "q3",
                    "text": "What should you do if you identify a hazard?",
                    "options": [
                      { "id": "a", "text": "Ignore it if it's minor" },
                      { "id": "b", "text": "Report it immediately to your supervisor" },
                      { "id": "c", "text": "Fix it yourself without telling anyone" },
                      { "id": "d", "text": "Wait until someone else notices" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "All hazards must be reported immediately to prevent incidents."
                  },
                  {
                    "id": "q4",
                    "text": "What does PPE stand for?",
                    "options": [
                      { "id": "a", "text": "Personal Protection Equipment" },
                      { "id": "b", "text": "Personal Protective Equipment" },
                      { "id": "c", "text": "Professional Practice Ethics" },
                      { "id": "d", "text": "Protective Personal Essentials" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "PPE is Personal Protective Equipment used to ensure worker safety."
                  }
                ]
            },
            {
                "id": "quiz-6",
                "title": "Rights and Advocacy",
                "description": "Understanding the rights of people with disabilities and the role of advocacy.",
                "time_limit": 360,
                "points_reward": 110,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What is self-advocacy?",
                    "options": [
                      { "id": "a", "text": "Having others speak for you" },
                      { "id": "b", "text": "Speaking up for yourself and making your own decisions" },
                      { "id": "c", "text": "Avoiding conflict" },
                      { "id": "d", "text": "Legal representation" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Self-advocacy is about speaking up for yourself and making your own decisions."
                  },
                  {
                    "id": "q2",
                    "text": "People with disabilities have the right to:",
                    "options": [
                      { "id": "a", "text": "Special treatment only" },
                      { "id": "b", "text": "The same human rights as everyone else" },
                      { "id": "c", "text": "Limited choices for their own safety" },
                      { "id": "d", "text": "Be protected from all decisions" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "People with disabilities have the same human rights as everyone else."
                  },
                  {
                    "id": "q3",
                    "text": "What is informed consent?",
                    "options": [
                      { "id": "a", "text": "Agreeing to anything asked" },
                      { "id": "b", "text": "Agreement given with full understanding of implications and alternatives" },
                      { "id": "c", "text": "Written permission only" },
                      { "id": "d", "text": "Family giving permission" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Informed consent requires full understanding of what you're agreeing to."
                  },
                  {
                    "id": "q4",
                    "text": "What should you do if you witness abuse or neglect?",
                    "options": [
                      { "id": "a", "text": "Keep quiet to avoid trouble" },
                      { "id": "b", "text": "Report it immediately according to organizational policy" },
                      { "id": "c", "text": "Confront the person privately" },
                      { "id": "d", "text": "Wait to see if it happens again" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Abuse or neglect must be reported immediately following proper procedures."
                  }
                ]
            },
            {
                "id": "quiz-7",
                "title": "Cultural Competence & Diversity",
                "description": "Learn to provide culturally appropriate and inclusive support services.",
                "time_limit": 300,
                "points_reward": 90,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What is cultural competence?",
                    "options": [
                      { "id": "a", "text": "Treating everyone exactly the same" },
                      { "id": "b", "text": "Understanding and respecting cultural differences in service delivery" },
                      { "id": "c", "text": "Only working with people from your own culture" },
                      { "id": "d", "text": "Ignoring cultural backgrounds" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Cultural competence means understanding and respecting cultural differences."
                  },
                  {
                    "id": "q2",
                    "text": "How should you address cultural dietary requirements?",
                    "options": [
                      { "id": "a", "text": "Ignore them as inconvenient" },
                      { "id": "b", "text": "Respect and accommodate them as part of person-centered care" },
                      { "id": "c", "text": "Try to convince them to change" },
                      { "id": "d", "text": "Make them prepare their own food" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Cultural dietary requirements should be respected as part of person-centered care."
                  },
                  {
                    "id": "q3",
                    "text": "What is unconscious bias?",
                    "options": [
                      { "id": "a", "text": "Deliberate discrimination" },
                      { "id": "b", "text": "Automatic preferences or stereotypes we hold without awareness" },
                      { "id": "c", "text": "Only affects others, not yourself" },
                      { "id": "d", "text": "Something only managers deal with" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Unconscious bias refers to automatic stereotypes we hold without realizing it."
                  }
                ]
            },
            {
                "id": "quiz-8",
                "title": "Medication Management Basics",
                "description": "Essential knowledge for safe medication assistance in disability support.",
                "time_limit": 420,
                "points_reward": 130,
                "questions": [
                  {
                    "id": "q1",
                    "text": "The 5 Rights of medication administration are:",
                    "options": [
                      { "id": "a", "text": "Right person, drug, dose, route, time" },
                      { "id": "b", "text": "Right doctor, pharmacy, insurance, storage, disposal" },
                      { "id": "c", "text": "Right color, shape, size, taste, smell" },
                      { "id": "d", "text": "Right family, consent, witness, record, review" }
                    ],
                    "correctOptionId": "a",
                    "explanation": "The 5 Rights are: person, drug, dose, route, and time."
                  },
                  {
                    "id": "q2",
                    "text": "What should you do if you notice a medication error?",
                    "options": [
                      { "id": "a", "text": "Hide it to avoid consequences" },
                      { "id": "b", "text": "Report immediately and follow emergency procedures" },
                      { "id": "c", "text": "Wait to see if there are any effects" },
                      { "id": "d", "text": "Correct it yourself without telling anyone" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Medication errors must be reported immediately to ensure client safety."
                  },
                  {
                    "id": "q3",
                    "text": "How should medications be stored?",
                    "options": [
                      { "id": "a", "text": "Anywhere convenient" },
                      { "id": "b", "text": "In a secure, appropriate location according to storage requirements" },
                      { "id": "c", "text": "In the bathroom cabinet" },
                      { "id": "d", "text": "Mixed together in one container" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Medications must be stored securely according to their specific requirements."
                  },
                  {
                    "id": "q4",
                    "text": "What does PRN mean on a medication chart?",
                    "options": [
                      { "id": "a", "text": "Prescribed Regular Nutrition" },
                      { "id": "b", "text": "Pro Re Nata (as needed)" },
                      { "id": "c", "text": "Personal Responsibility Notice" },
                      { "id": "d", "text": "Prevent Repeating Nightly" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "PRN means 'Pro Re Nata' or 'as needed' in Latin."
                  }
                ]
            },
            {
                "id": "quiz-9",
                "title": "Mental Health Awareness",
                "description": "Understanding mental health in the context of disability support services.",
                "time_limit": 360,
                "points_reward": 110,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What is mental health stigma?",
                    "options": [
                      { "id": "a", "text": "A medical diagnosis" },
                      { "id": "b", "text": "Negative attitudes and discrimination towards people with mental health conditions" },
                      { "id": "c", "text": "A type of medication" },
                      { "id": "d", "text": "A support group" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Stigma refers to negative attitudes and discrimination towards mental health conditions."
                  },
                  {
                    "id": "q2",
                    "text": "What is a trauma-informed approach?",
                    "options": [
                      { "id": "a", "text": "Ignoring past trauma" },
                      { "id": "b", "text": "Recognizing the impact of trauma and providing sensitive, safe support" },
                      { "id": "c", "text": "Only for mental health professionals" },
                      { "id": "d", "text": "Asking detailed questions about traumatic events" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Trauma-informed care recognizes trauma's impact and provides sensitive support."
                  },
                  {
                    "id": "q3",
                    "text": "How can you support someone's mental wellbeing?",
                    "options": [
                      { "id": "a", "text": "Tell them to 'just be positive'" },
                      { "id": "b", "text": "Listen without judgment, respect their feelings, and encourage professional help if needed" },
                      { "id": "c", "text": "Share their concerns with others" },
                      { "id": "d", "text": "Give medical advice" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Supporting mental wellbeing involves non-judgmental listening and respect."
                  },
                  {
                    "id": "q4",
                    "text": "What should you do in a mental health crisis?",
                    "options": [
                      { "id": "a", "text": "Leave the person alone" },
                      { "id": "b", "text": "Follow emergency protocols, ensure safety, and contact appropriate services" },
                      { "id": "c", "text": "Restrain the person immediately" },
                      { "id": "d", "text": "Post about it on social media" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Mental health crises require following emergency protocols and ensuring safety."
                  }
                ]
            },
            {
                "id": "quiz-10",
                "title": "Professional Development & Teamwork",
                "description": "Building effective teams and continuing professional growth in the disability sector.",
                "time_limit": 300,
                "points_reward": 100,
                "questions": [
                  {
                    "id": "q1",
                    "text": "What is reflective practice?",
                    "options": [
                      { "id": "a", "text": "Looking in a mirror" },
                      { "id": "b", "text": "Thinking critically about your practice to improve performance" },
                      { "id": "c", "text": "Repeating the same actions" },
                      { "id": "d", "text": "Avoiding mistakes" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Reflective practice involves critical thinking about your work to improve."
                  },
                  {
                    "id": "q2",
                    "text": "What makes an effective team in disability support?",
                    "options": [
                      { "id": "a", "text": "Everyone working independently" },
                      { "id": "b", "text": "Clear communication, shared goals, and mutual respect" },
                      { "id": "c", "text": "One leader making all decisions" },
                      { "id": "d", "text": "Avoiding all conflict" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Effective teams communicate clearly and respect each other while working toward shared goals."
                  },
                  {
                    "id": "q3",
                    "text": "Why is ongoing training important?",
                    "options": [
                      { "id": "a", "text": "It's not - initial training is enough" },
                      { "id": "b", "text": "To stay current with best practices and improve service quality" },
                      { "id": "c", "text": "Only for new employees" },
                      { "id": "d", "text": "Just to meet regulatory requirements" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Ongoing training ensures current best practices and quality service delivery."
                  },
                  {
                    "id": "q4",
                    "text": "How should you handle disagreements with team members?",
                    "options": [
                      { "id": "a", "text": "Ignore them and hope they go away" },
                      { "id": "b", "text": "Address professionally and respectfully, focusing on solutions" },
                      { "id": "c", "text": "Complain to clients about colleagues" },
                      { "id": "d", "text": "Always agree to avoid conflict" }
                    ],
                    "correctOptionId": "b",
                    "explanation": "Professional conflict resolution focuses on respectful, solution-oriented discussion."
                  }
                ]
            }
        ]

        for q_data in quizzes:
            quiz = Quiz(
                id=q_data['id'],
                title=q_data['title'],
                description=q_data['description'],
                time_limit=q_data['time_limit'],
                points_reward=q_data['points_reward'],
                questions=q_data['questions']
            )
            db.session.add(quiz)
        
        db.session.commit()
        print(f"Successfully seeded {len(quizzes)} quizzes!")

if __name__ == '__main__':
    seed()
