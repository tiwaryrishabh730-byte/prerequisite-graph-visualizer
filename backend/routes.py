from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

# Mock data (replace with Firebase later)
GRAPH_DATA = {
    "nodes": [
        {"id": "algebra", "label": "Basic Algebra", "mastery": 0.8},
        {"id": "factorization", "label": "Factorization", "mastery": 0.4},
        {"id": "quadratics", "label": "Quadratic Equations", "mastery": 0.5},
        {"id": "applications", "label": "Applications", "mastery": 0.0}
    ],
    "edges": [
        {"source": "algebra", "target": "factorization"},
        {"source": "factorization", "target": "quadratics"},
        {"source": "quadratics", "target": "applications"}
    ]
}

class QuizSubmission(BaseModel):
    answers: List[Dict]

@router.get("/api/graph")
async def get_graph():
    return GRAPH_DATA

@router.get("/api/questions/{topic}")
async def get_questions(topic: str):
    # Return mock questions (replace with Firebase query)
    return [
        {"id": 1, "question": "Solve: 2x + 3 = 7", "options": ["x=2", "x=3", "x=4"], "correct": 0},
        {"id": 2, "question": "Factorize: x² + 5x + 6", "options": ["(x+2)(x+3)", "(x+1)(x+6)", "(x+3)(x+2)"], "correct": 0}
    ]

@router.post("/api/submit-quiz")
async def submit_quiz(submission: QuizSubmission):
    # Calculate mastery (replace with rules.py logic)
    correct = sum(1 for ans in submission.answers if ans.get('is_correct', False))
    total = len(submission.answers)
    mastery = correct / total if total > 0 else 0
    
    return {
        "mastery": {
            "algebra": 0.8,
            "factorization": mastery,
            "quadratics": 0.5
        }
    }

@router.get("/api/student/{student_id}/mastery")
async def get_student_mastery(student_id: str):
    return {
        "algebra": 0.8,
        "factorization": 0.4,
        "quadratics": 0.5
    }

@router.get("/api/teacher/class/{class_id}/heatmap")
async def get_class_heatmap(class_id: str):
    return [
        {"student": "Rohit", "algebra": 0.8, "factorization": 0.4, "quadratics": 0.5},
        {"student": "Priya", "algebra": 0.9, "factorization": 0.8, "quadratics": 0.9},
        {"student": "Ankit", "algebra": 0.6, "factorization": 0.3, "quadratics": 0.4}
    ]