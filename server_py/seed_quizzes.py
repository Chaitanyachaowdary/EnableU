import json
from app import create_app
from extensions import db
from models import Quiz

def seed_quizzes():
    app = create_app()
    with app.app_context():
        # Load JSON data
        try:
            with open('../server/quizzes.json', 'r') as f:
                quizzes_data = json.load(f)
        except FileNotFoundError:
            print("❌ quizzes.json not found in ../server/")
            return

        for q_data in quizzes_data:
            existing = Quiz.query.get(q_data['id'])
            if not existing:
                quiz = Quiz(
                    id=q_data['id'],
                    title=q_data['title'],
                    description=q_data['description'],
                    time_limit=q_data.get('timeLimit', 300),
                    points_reward=q_data.get('points', 50),
                    questions=q_data['questions']
                )
                db.session.add(quiz)
                print(f"✅ Added quiz: {quiz.title}")
            else:
                print(f"ℹ️ Quiz already exists: {existing.title}")
        
        db.session.commit()
        print("🚀 Seeding complete!")

if __name__ == '__main__':
    seed_quizzes()
