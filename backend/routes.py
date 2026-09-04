from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()

# Mock data (replace with Firebase later)
GRAPH_DATA = {
    "nodes": [
        {"id": "algebra", "label": "Basic Algebra", "mastery": 0.8, "position": {"x": 100, "y": 100}},
        {"id": "factorization", "label": "Factorization", "mastery": 0.4, "position": {"x": 350, "y": 100}},
        {"id": "quadratics", "label": "Quadratic Equations", "mastery": 0.5, "position": {"x": 600, "y": 100}},
        {"id": "applications", "label": "Applications", "mastery": 0.0, "position": {"x": 850, "y": 100}}
    ],
    "edges": [
        {"source": "algebra", "target": "factorization"},
        {"source": "factorization", "target": "quadratics"},
        {"source": "quadratics", "target": "applications"}
    ]
}

STUDENT_MASTERY = {
    "algebra": None,
    "factorization": None,
    "quadratics": None,
    "applications": None
}

QUESTION_BANK = {
    "algebra": [
        {"id": 1, "question": "Solve: 2x + 3 = 7", "options": ["x=2", "x=3", "x=4"], "correct": 0, "topic": "algebra"},
        {"id": 2, "question": "Solve: 3x - 5 = 10", "options": ["x=3", "x=5", "x=15"], "correct": 1, "topic": "algebra"},
        {"id": 3, "question": "Simplify: 4a + 3a", "options": ["a", "4a", "7a"], "correct": 2, "topic": "algebra"},
        {"id": 4, "question": "If y = 3, what is 2y + 1?", "options": ["5", "6", "7"], "correct": 2, "topic": "algebra"}
    ],
    "factorization": [
        {"id": 5, "question": "Factorize: x^2 + 5x + 6", "options": ["(x+2)(x+3)", "(x+1)(x+6)", "(x+3)(x+4)"], "correct": 0, "topic": "factorization"},
        {"id": 6, "question": "Factorize: 3x + 6", "options": ["3(x+1)", "3(x+2)", "x+6"], "correct": 1, "topic": "factorization"},
        {"id": 7, "question": "Factorize: x^2 - 9", "options": ["(x-9)(x+1)", "(x-3)^2", "(x-3)(x+3)"], "correct": 2, "topic": "factorization"},
        {"id": 8, "question": "Factorize: x^2 - 7x + 12", "options": ["(x-3)(x-4)", "(x-2)(x-6)", "(x+3)(x+4)"], "correct": 0, "topic": "factorization"}
    ],
    "quadratics": [
        {"id": 9, "question": "Solve: x^2 - 5x + 6 = 0", "options": ["x=2 or x=3", "x=1 or x=6", "x=-2 or x=-3"], "correct": 0, "topic": "quadratics"},
        {"id": 10, "question": "Solve: x^2 - 9 = 0", "options": ["x=3", "x=-3 or x=3", "x=9"], "correct": 1, "topic": "quadratics"},
        {"id": 11, "question": "What is the discriminant of x^2 + 4x + 1 = 0?", "options": ["4", "8", "12"], "correct": 2, "topic": "quadratics"},
        {"id": 12, "question": "Solve: x^2 + 2x + 1 = 0", "options": ["x=-1", "x=1", "x=-2"], "correct": 0, "topic": "quadratics"}
    ],
    "applications": [
        {"id": 13, "question": "A rectangle has width x, length x+3, and area 40. Which equation finds x?", "options": ["x^2+3x+40=0", "x^2+3x-40=0", "x^2-3x-40=0"], "correct": 1, "topic": "applications"},
        {"id": 14, "question": "A ball's height is h=-t^2+6t+7. At what positive time does it hit the ground?", "options": ["t=1", "t=6", "t=7"], "correct": 2, "topic": "applications"},
        {"id": 15, "question": "A rectangular garden has width x, length x+4, and area 48. What is its positive width?", "options": ["4", "6", "8"], "correct": 1, "topic": "applications"},
        {"id": 16, "question": "The product of two consecutive positive integers is 56. What is the smaller integer?", "options": ["6", "7", "8"], "correct": 1, "topic": "applications"}
    ]
}

class QuizSubmission(BaseModel):
    answers: List[Dict]

@router.get("/api/graph")
async def get_graph():
    return {
        "nodes": [
            {**node, "mastery": STUDENT_MASTERY[node["id"]]}
            for node in GRAPH_DATA["nodes"]
        ],
        "edges": GRAPH_DATA["edges"]
    }
    
@router.get("/api/questions/{topic}")
async def get_questions(topic: str):
    return QUESTION_BANK.get(topic, [])

@router.post("/api/submit-quiz")
async def submit_quiz(submission: QuizSubmission):
    topic_results = {}
    for answer in submission.answers:
        topic = answer.get("topic", "factorization")
        result = topic_results.setdefault(topic, {"correct": 0, "total": 0})
        result["total"] += 1
        if answer.get("is_correct", False):
            result["correct"] += 1

    for topic, result in topic_results.items():
        STUDENT_MASTERY[topic] = result["correct"] / result["total"]

    return {"mastery": STUDENT_MASTERY}

@router.post("/api/reset")
async def reset_mastery():
    for topic in STUDENT_MASTERY:
        STUDENT_MASTERY[topic] = None
    return {"status": "reset"}

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