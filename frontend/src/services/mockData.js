// Demo data. Replace with real API responses (see services/api.js).
export const demoUser = { name: 'Alex', email: 'alex@example.com' };

export const weights = [
  { key: 'correctness', label: 'Correctness', weight: 30, color: '#22d3ee' },
  { key: 'relevance', label: 'Relevance', weight: 20, color: '#fbbf24' },
  { key: 'completeness', label: 'Completeness', weight: 20, color: '#c4a4ea' },
  { key: 'structure', label: 'Structure', weight: 15, color: '#6b9de8' },
  { key: 'examples', label: 'Examples', weight: 15, color: '#0f766e' },
];

export const repos = [
  { id: 'repo_001', name: 'student-management', languages: ['Java', 'JavaScript'], files: 45, classes: 12, functions: 37, status: 'completed', branch: 'main' },
  { id: 'repo_002', name: 'student-performance-predictor', languages: ['Python'], files: 18, classes: 3, functions: 21, status: 'completed', branch: 'main' },
  { id: 'repo_003', name: 'chat-app', languages: ['JavaScript'], files: 0, classes: 0, functions: 0, status: 'not_analyzed', branch: 'main' },
];

export const history = [
  { id: 'i5', date: '18 Nov', repo: 'student-management', type: 'Project defense', score: 78, duration: '24 min' },
  { id: 'i4', date: '14 Nov', repo: 'student-performance-predictor', type: 'Technical', score: 74, duration: '30 min' },
  { id: 'i3', date: '09 Nov', repo: 'student-management', type: 'Project defense', score: 69, duration: '22 min' },
  { id: 'i2', date: '03 Nov', repo: 'chat-app', type: 'Technical', score: 63, duration: '18 min' },
  { id: 'i1', date: '27 Oct', repo: 'student-management', type: 'Project defense', score: 58, duration: '20 min' },
];

export const topics = [
  { topic: 'Java OOP', score: 85 },
  { topic: 'Machine Learning', score: 80 },
  { topic: 'DBMS', score: 75 },
  { topic: 'Operating Systems', score: 65 },
  { topic: 'Data Structures & Algorithms', score: 55 },
];

export const learningPath = ['Arrays', 'Sorted arrays', 'Search algorithms', 'Binary search', 'Time complexity', 'Binary search practice'];

export const insights = [
  { kind: 'strength', title: 'Strength insight', text: 'Your explanation of class design in the Student module was clear and matched the code.' },
  { kind: 'improve', title: 'Improvement', text: 'Answers about search and time complexity were incomplete.' },
  { kind: 'action', title: 'Actionable recommendation', text: 'Re-read find_student() in student_manager.py, then practice explaining linear vs binary search.' },
];

export const practiceTiles = [
  { icon: '💡', label: 'Concept review', to: '/progress' },
  { icon: '🎯', label: 'Weak-topic drill', to: '/interview?type=practice' },
  { icon: '🗣️', label: 'Voice practice', to: '/interview?type=practice' },
  { icon: '📝', label: 'Last report', to: '/report' },
];

export const questions = [
  {
    id: 'q1', category: 'Code explanation', difficulty: 'Intermediate',
    text: 'Walk me through how find_student() locates a record. What is its time complexity, and how would you speed it up for 100,000 students?',
    keywords: ['loop', 'linear', 'o(n)', 'every', 'sorted', 'binary', 'hash', 'dictionary', 'index'],
    evidence: { file: 'student_manager.py', startLine: 12, lines: ['def find_student(students, roll_no):', '    # students may be in any order', '    for s in students:', '        if s.roll_no == roll_no:', '            return s', '    return None'], highlight: [2, 3, 4] },
  },
  {
    id: 'q2', category: 'Architecture', difficulty: 'Intermediate',
    text: 'Why did you separate StudentManager from the Student class? What does each one own?',
    keywords: ['responsibility', 'single', 'separate', 'manager', 'model', 'data', 'logic', 'reuse', 'test'],
    evidence: { file: 'StudentManager.java', startLine: 8, lines: ['public class StudentManager {', '    private final List<Student> students = new ArrayList<>();', '', '    public void add(Student s) { students.add(s); }', '    public Optional<Student> find(int roll) { ... }', '}'], highlight: [1, 3, 4] },
  },
  {
    id: 'q3', category: 'Error handling', difficulty: 'Advanced',
    text: 'What happens in your application when the database connection fails? How would you make it more resilient?',
    keywords: ['exception', 'try', 'catch', 'retry', 'timeout', 'fallback', 'log', 'pool', 'error'],
    evidence: { file: 'DatabaseConnection.java', startLine: 21, lines: ['try {', '    conn = DriverManager.getConnection(url, user, pass);', '} catch (SQLException e) {', '    e.printStackTrace();', '}', 'return conn;'], highlight: [2, 3] },
  },
];
