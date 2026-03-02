export type Level = "beginner" | "intermediate" | "advanced";
export interface DSATopic {
  id: string;
  level: Level;
  category: string;
  title: string;
  explanation: string;
  realLifeExample: string;
  operations: string[];
  pythonCode: string;
  javaCode: string;
  complexity: {
    time: string;
    space: string;
    bestCase: string;
    worstCase: string;
  };
  diagram: string;
}

export const DSA_INTRO = {
  whatIsDSA: `Data Structures and Algorithms (DSA) is the study of organizing data efficiently and solving computational problems using well-defined step-by-step procedures.\n\nA **Data Structure** is a way of storing and organizing data so it can be accessed and modified efficiently. Examples include arrays, linked lists, trees, and graphs.\n\nAn **Algorithm** is a finite set of instructions that takes input, processes it, and produces the desired output. Algorithms power everything from search engines to GPS navigation.`,
  whyLearnDSA: [
    "Improves logical thinking and problem-solving ability",
    "Required in technical interviews at top companies (Google, Amazon, Meta)",
    "Helps write efficient, optimized code that scales",
    "Foundation of all software — databases, operating systems, AI, web apps",
    "Makes you a stronger, more versatile developer",
  ],
};

/* ════════════════════════════════════════════════════════
   SVG diagram helpers
   ════════════════════════════════════════════════════════ */
const BOX = (x: number, y: number, v: string, c = "#3b8beb") =>
  `<rect x="${x}" y="${y}" width="48" height="36" rx="6" fill="${c}" opacity="0.85"/><text x="${x + 24}" y="${y + 23}" text-anchor="middle" fill="#fff" font-size="13" font-family="monospace">${v}</text>`;
const ARR = (vals: string[]) => {
  const bs = vals.map((v, i) => BOX(i * 56 + 10, 20, v));
  return `<svg viewBox="0 0 ${vals.length * 56 + 20} 76" xmlns="http://www.w3.org/2000/svg">${bs.join("")}</svg>`;
};
const ARROW = (x1: number, y1: number, x2: number, y2: number) =>
  `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#9999b0" stroke-width="2" marker-end="url(#ah)"/>`;
const ARROWHEAD = `<defs><marker id="ah" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto"><polygon points="0 0, 10 3.5, 0 7" fill="#9999b0"/></marker></defs>`;

const LL_DIAGRAM = `<svg viewBox="0 0 380 60" xmlns="http://www.w3.org/2000/svg">${ARROWHEAD}${BOX(10, 12, "10")}${ARROW(58, 30, 80, 30)}${BOX(80, 12, "20", "#bf5af2")}${ARROW(128, 30, 150, 30)}${BOX(150, 12, "30")}${ARROW(198, 30, 220, 30)}${BOX(220, 12, "40", "#30d158")}${ARROW(268, 30, 290, 30)}<text x="305" y="35" fill="#ff453a" font-size="14" font-family="monospace">null</text></svg>`;

const STACK_DIAGRAM = `<svg viewBox="0 0 120 180" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="140" width="100" height="30" rx="4" fill="#3b8beb" opacity="0.8"/><text x="60" y="160" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">10</text><rect x="10" y="105" width="100" height="30" rx="4" fill="#bf5af2" opacity="0.8"/><text x="60" y="125" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">20</text><rect x="10" y="70" width="100" height="30" rx="4" fill="#30d158" opacity="0.8"/><text x="60" y="90" text-anchor="middle" fill="#fff" font-size="12" font-family="monospace">30</text><text x="60" y="18" text-anchor="middle" fill="#ffd60a" font-size="11" font-family="monospace">← TOP</text><line x1="60" y1="22" x2="60" y2="65" stroke="#ffd60a" stroke-width="1.5" stroke-dasharray="4"/></svg>`;

const QUEUE_DIAGRAM = `<svg viewBox="0 0 340 70" xmlns="http://www.w3.org/2000/svg">${ARROWHEAD}<text x="10" y="18" fill="#30d158" font-size="10" font-family="monospace">FRONT</text>${BOX(10, 25, "10", "#30d158")}${BOX(66, 25, "20")}${BOX(122, 25, "30")}${BOX(178, 25, "40", "#bf5af2")}<text x="178" y="18" fill="#bf5af2" font-size="10" font-family="monospace">REAR</text>${ARROW(234, 43, 260, 43)}<text x="265" y="48" fill="#9999b0" font-size="11" font-family="monospace">enqueue</text></svg>`;

const TREE_DIAGRAM = `<svg viewBox="0 0 280 160" xmlns="http://www.w3.org/2000/svg">${ARROWHEAD}<line x1="140" y1="36" x2="70" y2="72" stroke="#9999b0" stroke-width="2"/><line x1="140" y1="36" x2="210" y2="72" stroke="#9999b0" stroke-width="2"/><line x1="70" y1="108" x2="35" y2="130" stroke="#9999b0" stroke-width="2"/><line x1="70" y1="108" x2="105" y2="130" stroke="#9999b0" stroke-width="2"/>${BOX(116, 5, "50", "#ffd60a")}${BOX(46, 72, "30", "#3b8beb")}${BOX(186, 72, "70", "#3b8beb")}${BOX(11, 125, "20", "#30d158")}${BOX(81, 125, "40", "#30d158")}</svg>`;

const GRAPH_DIAGRAM = `<svg viewBox="0 0 260 180" xmlns="http://www.w3.org/2000/svg"><circle cx="130" cy="30" r="22" fill="#3b8beb" opacity="0.85"/><text x="130" y="35" text-anchor="middle" fill="#fff" font-size="13" font-family="monospace">A</text><circle cx="50" cy="100" r="22" fill="#bf5af2" opacity="0.85"/><text x="50" y="105" text-anchor="middle" fill="#fff" font-size="13" font-family="monospace">B</text><circle cx="210" cy="100" r="22" fill="#30d158" opacity="0.85"/><text x="210" y="105" text-anchor="middle" fill="#fff" font-size="13" font-family="monospace">C</text><circle cx="130" cy="155" r="22" fill="#ff9f0a" opacity="0.85"/><text x="130" y="160" text-anchor="middle" fill="#fff" font-size="13" font-family="monospace">D</text><line x1="130" y1="52" x2="50" y2="80" stroke="#9999b0" stroke-width="2"/><line x1="130" y1="52" x2="210" y2="80" stroke="#9999b0" stroke-width="2"/><line x1="50" y1="122" x2="130" y2="135" stroke="#9999b0" stroke-width="2"/><line x1="210" y1="122" x2="130" y2="135" stroke="#9999b0" stroke-width="2"/></svg>`;

/* ════════════════════════════════════════════════════════
   TOPICS
   ════════════════════════════════════════════════════════ */
export const DSA_TOPICS: DSATopic[] = [
  // ── BEGINNER ──────────────────────────────────────
  {
    id: "arrays",
    level: "beginner",
    category: "Data Structures",
    title: "Arrays",
    explanation:
      "An array is a contiguous block of memory storing elements of the same type, accessed by index in O(1) time. Arrays are the most fundamental data structure in programming.",
    realLifeExample:
      "A row of mailboxes numbered 0–99 — you can instantly go to box #42 without checking all others.",
    operations: [
      "Access by index — O(1)",
      "Search — O(n)",
      "Insert at end — O(1) amortized",
      "Insert at position — O(n)",
      "Delete — O(n)",
    ],
    pythonCode: `# Array operations in Python
arr = [10, 20, 30, 40, 50]

# Access by index
print(arr[2])         # 30

# Append
arr.append(60)        # [10,20,30,40,50,60]

# Insert at index
arr.insert(1, 15)     # [10,15,20,30,40,50,60]

# Delete
arr.remove(30)        # [10,15,20,40,50,60]

# Traversal
for i, val in enumerate(arr):
    print(f"Index {i}: {val}")`,
    javaCode: `// Array operations in Java
int[] arr = {10, 20, 30, 40, 50};

// Access by index
System.out.println(arr[2]); // 30

// Traversal
for (int i = 0; i < arr.length; i++) {
    System.out.println("Index " + i + ": " + arr[i]);
}

// Using ArrayList for dynamic arrays
import java.util.ArrayList;
ArrayList<Integer> list = new ArrayList<>();
list.add(10);
list.add(20);
list.add(1, 15);   // Insert at index 1
list.remove(Integer.valueOf(20)); // Remove value`,
    complexity: {
      time: "O(1) access, O(n) search",
      space: "O(n)",
      bestCase: "O(1) — direct index access",
      worstCase: "O(n) — linear search or insert/delete",
    },
    diagram: ARR(["10", "20", "30", "40", "50"]),
  },
  {
    id: "strings",
    level: "beginner",
    category: "Data Structures",
    title: "Strings",
    explanation:
      "A string is an immutable sequence of characters. String manipulation is one of the most common tasks in programming — parsing, searching, formatting, and pattern matching.",
    realLifeExample:
      "A sentence in a book — you can read any character by position, search for words, or split into individual words.",
    operations: [
      "Access character — O(1)",
      "Concatenation — O(n)",
      "Substring search — O(n*m)",
      "Reverse — O(n)",
      "Split/Join — O(n)",
    ],
    pythonCode: `# String operations in Python
s = "Hello, World!"

# Access
print(s[0])           # 'H'
print(s[-1])          # '!'

# Slice
print(s[0:5])         # 'Hello'

# Reverse
print(s[::-1])        # '!dlroW ,olleH'

# Search
print(s.find("World"))  # 7
print("World" in s)     # True

# Split & Join
words = s.split(", ")   # ['Hello', 'World!']
joined = " - ".join(words)`,
    javaCode: `// String operations in Java
String s = "Hello, World!";

// Access
char c = s.charAt(0);    // 'H'

// Substring
String sub = s.substring(0, 5); // "Hello"

// Reverse
String rev = new StringBuilder(s).reverse().toString();

// Search
int idx = s.indexOf("World"); // 7
boolean has = s.contains("World"); // true

// Split & Join
String[] words = s.split(", ");
String joined = String.join(" - ", words);`,
    complexity: {
      time: "O(1) access, O(n) operations",
      space: "O(n)",
      bestCase: "O(1) — character access",
      worstCase: "O(n*m) — substring search",
    },
    diagram: `<svg viewBox="0 0 350 70" xmlns="http://www.w3.org/2000/svg">${["H", "e", "l", "l", "o"].map((c, i) => BOX(i * 56 + 10, 17, c, "#bf5af2")).join("")}</svg>`,
  },
  {
    id: "linear-search",
    level: "beginner",
    category: "Searching",
    title: "Linear Search",
    explanation:
      "Linear search checks every element one by one until the target is found or the list ends. Simple but slow for large datasets.",
    realLifeExample:
      "Looking for a specific book by checking every shelf from left to right in a library with no catalog.",
    operations: [
      "Iterate through each element",
      "Compare with target",
      "Return index if found",
      "Return -1 if not found",
    ],
    pythonCode: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i
    return -1

# Example
data = [5, 3, 8, 1, 9, 2]
result = linear_search(data, 8)
print(f"Found at index: {result}")  # 2`,
    javaCode: `public static int linearSearch(int[] arr, int target) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }
    return -1;
}

// Example
int[] data = {5, 3, 8, 1, 9, 2};
int result = linearSearch(data, 8);
System.out.println("Found at index: " + result); // 2`,
    complexity: {
      time: "O(n)",
      space: "O(1)",
      bestCase: "O(1) — target is first element",
      worstCase: "O(n) — target is last or absent",
    },
    diagram: ARR(["5", "3", "8✓", "1", "9"]),
  },
  {
    id: "binary-search",
    level: "beginner",
    category: "Searching",
    title: "Binary Search",
    explanation:
      "Binary search works on sorted arrays by repeatedly dividing the search interval in half. It compares the target with the middle element and eliminates half the remaining elements each step.",
    realLifeExample:
      "Finding a word in a dictionary — you open to the middle, then decide whether to go left or right based on alphabetical order.",
    operations: [
      "Set low and high pointers",
      "Find mid = (low+high)/2",
      "Compare target with mid",
      "Narrow search to left or right half",
      "Repeat until found or low > high",
    ],
    pythonCode: `def binary_search(arr, target):
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1

# Example (array must be sorted)
data = [1, 3, 5, 7, 9, 11, 13]
result = binary_search(data, 7)
print(f"Found at index: {result}")  # 3`,
    javaCode: `public static int binarySearch(int[] arr, int target) {
    int low = 0, high = arr.length - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

// Example
int[] data = {1, 3, 5, 7, 9, 11, 13};
int result = binarySearch(data, 7);
System.out.println("Found at index: " + result); // 3`,
    complexity: {
      time: "O(log n)",
      space: "O(1)",
      bestCase: "O(1) — target is middle element",
      worstCase: "O(log n)",
    },
    diagram: ARR(["1", "3", "5", "7✓", "9", "11", "13"]),
  },
  {
    id: "bubble-sort",
    level: "beginner",
    category: "Sorting",
    title: "Bubble Sort",
    explanation:
      "Bubble sort repeatedly swaps adjacent elements if they are in the wrong order. Largest elements 'bubble up' to the end in each pass. Simple but inefficient for large datasets.",
    realLifeExample:
      "Sorting playing cards by comparing two adjacent cards and swapping them until all are in order.",
    operations: [
      "Compare adjacent elements",
      "Swap if out of order",
      "Repeat for n-1 passes",
      "Optimization: stop if no swaps in a pass",
    ],
    pythonCode: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break
    return arr

data = [64, 34, 25, 12, 22]
print(bubble_sort(data))  # [12, 22, 25, 34, 64]`,
    javaCode: `public static void bubbleSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        boolean swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = true;
            }
        }
        if (!swapped) break;
    }
}`,
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      bestCase: "O(n) — already sorted with optimization",
      worstCase: "O(n²) — reverse sorted",
    },
    diagram: ARR(["64", "34", "25", "12", "22"]),
  },
  {
    id: "selection-sort",
    level: "beginner",
    category: "Sorting",
    title: "Selection Sort",
    explanation:
      "Selection sort finds the minimum element from the unsorted part and places it at the beginning. It divides the array into sorted and unsorted regions.",
    realLifeExample:
      "Picking the smallest item from a pile and placing it in a sorted line, then repeating.",
    operations: [
      "Find minimum in unsorted section",
      "Swap with first unsorted element",
      "Move boundary of sorted section",
      "Repeat until fully sorted",
    ],
    pythonCode: `def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

data = [64, 25, 12, 22, 11]
print(selection_sort(data))  # [11, 12, 22, 25, 64]`,
    javaCode: `public static void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
    }
}`,
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      bestCase: "O(n²)",
      worstCase: "O(n²)",
    },
    diagram: ARR(["11", "12", "22", "25", "64"]),
  },
  {
    id: "insertion-sort",
    level: "beginner",
    category: "Sorting",
    title: "Insertion Sort",
    explanation:
      "Insertion sort builds the sorted array one element at a time by inserting each element into its correct position among the previously sorted elements.",
    realLifeExample:
      "Sorting playing cards in your hand — you pick each card and slide it into the correct position.",
    operations: [
      "Take next unsorted element",
      "Compare with sorted elements right-to-left",
      "Shift larger elements right",
      "Insert element in correct position",
    ],
    pythonCode: `def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr

data = [12, 11, 13, 5, 6]
print(insertion_sort(data))  # [5, 6, 11, 12, 13]`,
    javaCode: `public static void insertionSort(int[] arr) {
    for (int i = 1; i < arr.length; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
}`,
    complexity: {
      time: "O(n²)",
      space: "O(1)",
      bestCase: "O(n) — already sorted",
      worstCase: "O(n²) — reverse sorted",
    },
    diagram: ARR(["5", "6", "11", "12", "13"]),
  },
  // ── INTERMEDIATE ──────────────────────────────────
  {
    id: "linked-list",
    level: "intermediate",
    category: "Data Structures",
    title: "Linked List",
    explanation:
      "A linked list is a linear data structure where elements (nodes) are stored in non-contiguous memory. Each node contains data and a pointer to the next node. Unlike arrays, insertion and deletion are O(1) at known positions.",
    realLifeExample:
      "A treasure hunt — each clue tells you where to find the next clue. You must follow the chain sequentially.",
    operations: [
      "Insert at head — O(1)",
      "Insert at tail — O(n)",
      "Delete node — O(1) with reference",
      "Search — O(n)",
      "Reverse — O(n)",
    ],
    pythonCode: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None

    def insert_at_head(self, data):
        new_node = Node(data)
        new_node.next = self.head
        self.head = new_node

    def delete(self, key):
        curr = self.head
        if curr and curr.data == key:
            self.head = curr.next
            return
        while curr.next:
            if curr.next.data == key:
                curr.next = curr.next.next
                return
            curr = curr.next

    def display(self):
        curr = self.head
        while curr:
            print(curr.data, end=" -> ")
            curr = curr.next
        print("None")`,
    javaCode: `class Node {
    int data;
    Node next;
    Node(int d) { data = d; next = null; }
}

class LinkedList {
    Node head;

    void insertAtHead(int data) {
        Node newNode = new Node(data);
        newNode.next = head;
        head = newNode;
    }

    void delete(int key) {
        if (head != null && head.data == key) {
            head = head.next;
            return;
        }
        Node curr = head;
        while (curr.next != null) {
            if (curr.next.data == key) {
                curr.next = curr.next.next;
                return;
            }
            curr = curr.next;
        }
    }
}`,
    complexity: {
      time: "O(1) insert at head, O(n) search",
      space: "O(n)",
      bestCase: "O(1) — insert/delete at head",
      worstCase: "O(n) — search or tail operations",
    },
    diagram: LL_DIAGRAM,
  },
  {
    id: "stack",
    level: "intermediate",
    category: "Data Structures",
    title: "Stack",
    explanation:
      "A stack is a LIFO (Last In, First Out) data structure. The last element added is the first to be removed. Think of it as a stack of plates — you add and remove from the top only.",
    realLifeExample:
      "A stack of plates in a cafeteria — you can only take from the top and add to the top.",
    operations: [
      "Push (add to top) — O(1)",
      "Pop (remove from top) — O(1)",
      "Peek (view top) — O(1)",
      "isEmpty — O(1)",
    ],
    pythonCode: `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()

    def peek(self):
        if not self.is_empty():
            return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

# Parentheses matching example
def is_balanced(expr):
    stack = Stack()
    for char in expr:
        if char == '(':
            stack.push(char)
        elif char == ')':
            if stack.is_empty():
                return False
            stack.pop()
    return stack.is_empty()

print(is_balanced("((()))"))  # True
print(is_balanced("(()"))     # False`,
    javaCode: `import java.util.Stack;

Stack<Integer> stack = new Stack<>();
stack.push(10);
stack.push(20);
stack.push(30);

System.out.println(stack.peek()); // 30
System.out.println(stack.pop());  // 30
System.out.println(stack.size()); // 2

// Parentheses matching
public static boolean isBalanced(String expr) {
    Stack<Character> stack = new Stack<>();
    for (char c : expr.toCharArray()) {
        if (c == '(') stack.push(c);
        else if (c == ')') {
            if (stack.isEmpty()) return false;
            stack.pop();
        }
    }
    return stack.isEmpty();
}`,
    complexity: {
      time: "O(1) for all operations",
      space: "O(n)",
      bestCase: "O(1)",
      worstCase: "O(1)",
    },
    diagram: STACK_DIAGRAM,
  },
  {
    id: "queue",
    level: "intermediate",
    category: "Data Structures",
    title: "Queue",
    explanation:
      "A queue is a FIFO (First In, First Out) data structure. Elements are added at the rear and removed from the front. Used extensively in BFS, task scheduling, and buffering.",
    realLifeExample:
      "A line at a ticket counter — first person in line gets served first.",
    operations: [
      "Enqueue (add to rear) — O(1)",
      "Dequeue (remove from front) — O(1)",
      "Peek (view front) — O(1)",
      "isEmpty — O(1)",
    ],
    pythonCode: `from collections import deque

class Queue:
    def __init__(self):
        self.items = deque()

    def enqueue(self, item):
        self.items.append(item)

    def dequeue(self):
        if not self.is_empty():
            return self.items.popleft()

    def peek(self):
        if not self.is_empty():
            return self.items[0]

    def is_empty(self):
        return len(self.items) == 0

q = Queue()
q.enqueue(10)
q.enqueue(20)
q.enqueue(30)
print(q.dequeue())  # 10
print(q.peek())     # 20`,
    javaCode: `import java.util.LinkedList;
import java.util.Queue;

Queue<Integer> queue = new LinkedList<>();
queue.add(10);
queue.add(20);
queue.add(30);

System.out.println(queue.poll());  // 10
System.out.println(queue.peek());  // 20
System.out.println(queue.size());  // 2`,
    complexity: {
      time: "O(1) for all operations",
      space: "O(n)",
      bestCase: "O(1)",
      worstCase: "O(1)",
    },
    diagram: QUEUE_DIAGRAM,
  },
  {
    id: "hash-table",
    level: "intermediate",
    category: "Data Structures",
    title: "Hash Table",
    explanation:
      "A hash table stores key-value pairs using a hash function to compute an index. It provides near O(1) average-case lookups, insertions, and deletions. Collisions are handled via chaining or open addressing.",
    realLifeExample:
      "A phone book — you look up a name (key) to get the phone number (value) almost instantly.",
    operations: [
      "Insert — O(1) average",
      "Lookup — O(1) average",
      "Delete — O(1) average",
      "Handle collisions",
    ],
    pythonCode: `# Python dict IS a hash table
phone_book = {}
phone_book["Alice"] = "555-0101"
phone_book["Bob"]   = "555-0202"

# Lookup
print(phone_book["Alice"])     # 555-0101
print(phone_book.get("Eve"))   # None

# Check existence
if "Bob" in phone_book:
    print("Found Bob!")

# Delete
del phone_book["Bob"]

# Iterate
for name, number in phone_book.items():
    print(f"{name}: {number}")`,
    javaCode: `import java.util.HashMap;

HashMap<String, String> phoneBook = new HashMap<>();
phoneBook.put("Alice", "555-0101");
phoneBook.put("Bob",   "555-0202");

// Lookup
System.out.println(phoneBook.get("Alice")); // 555-0101

// Check existence
if (phoneBook.containsKey("Bob")) {
    System.out.println("Found Bob!");
}

// Delete
phoneBook.remove("Bob");

// Iterate
for (var entry : phoneBook.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}`,
    complexity: {
      time: "O(1) average, O(n) worst case",
      space: "O(n)",
      bestCase: "O(1) — no collisions",
      worstCase: "O(n) — all keys collide",
    },
    diagram: `<svg viewBox="0 0 300 140" xmlns="http://www.w3.org/2000/svg"><text x="10" y="20" fill="#ffd60a" font-size="11" font-family="monospace">Hash Table</text><rect x="10" y="30" width="60" height="25" rx="4" fill="#3b8beb" opacity="0.8"/><text x="40" y="47" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">[0]</text><rect x="10" y="60" width="60" height="25" rx="4" fill="#3b8beb" opacity="0.8"/><text x="40" y="77" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">[1]</text><rect x="10" y="90" width="60" height="25" rx="4" fill="#3b8beb" opacity="0.8"/><text x="40" y="107" text-anchor="middle" fill="#fff" font-size="10" font-family="monospace">[2]</text><rect x="90" y="30" width="80" height="25" rx="4" fill="#30d158" opacity="0.8"/><text x="130" y="47" text-anchor="middle" fill="#fff" font-size="9" font-family="monospace">Alice</text><rect x="90" y="60" width="80" height="25" rx="4" fill="#bf5af2" opacity="0.8"/><text x="130" y="77" text-anchor="middle" fill="#fff" font-size="9" font-family="monospace">Bob</text><rect x="90" y="90" width="80" height="25" rx="4" fill="#ff9f0a" opacity="0.8"/><text x="130" y="107" text-anchor="middle" fill="#fff" font-size="9" font-family="monospace">Charlie</text></svg>`,
  },
  {
    id: "recursion",
    level: "intermediate",
    category: "Concepts",
    title: "Recursion",
    explanation:
      "Recursion is when a function calls itself to break a problem into smaller subproblems. Every recursive function needs a base case (stopping condition) and a recursive case. It's the foundation for tree traversals, divide-and-conquer, and dynamic programming.",
    realLifeExample:
      "Russian nesting dolls — you open one to find a smaller one inside, and keep opening until you reach the smallest doll (base case).",
    operations: [
      "Define base case",
      "Define recursive case",
      "Call function on smaller input",
      "Combine results",
    ],
    pythonCode: `# Factorial using recursion
def factorial(n):
    if n <= 1:        # Base case
        return 1
    return n * factorial(n - 1)  # Recursive case

print(factorial(5))  # 120

# Fibonacci using recursion
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(8):
    print(fibonacci(i), end=" ")  # 0 1 1 2 3 5 8 13`,
    javaCode: `// Factorial
public static int factorial(int n) {
    if (n <= 1) return 1;       // Base case
    return n * factorial(n - 1); // Recursive case
}

System.out.println(factorial(5)); // 120

// Fibonacci
public static int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}`,
    complexity: {
      time: "O(n) factorial, O(2^n) naive fibonacci",
      space: "O(n) — call stack depth",
      bestCase: "O(1) — base case reached immediately",
      worstCase: "O(2^n) — exponential for naive fibonacci",
    },
    diagram: `<svg viewBox="0 0 280 120" xmlns="http://www.w3.org/2000/svg"><text x="140" y="15" text-anchor="middle" fill="#ffd60a" font-size="11" font-family="monospace">factorial(4)</text><line x1="140" y1="20" x2="140" y2="35" stroke="#9999b0" stroke-width="1.5"/><text x="140" y="48" text-anchor="middle" fill="#3b8beb" font-size="11" font-family="monospace">4 × factorial(3)</text><line x1="140" y1="52" x2="140" y2="65" stroke="#9999b0" stroke-width="1.5"/><text x="140" y="78" text-anchor="middle" fill="#bf5af2" font-size="11" font-family="monospace">3 × factorial(2)</text><line x1="140" y1="82" x2="140" y2="95" stroke="#9999b0" stroke-width="1.5"/><text x="140" y="108" text-anchor="middle" fill="#30d158" font-size="11" font-family="monospace">2 × factorial(1) → 1</text></svg>`,
  },
  // ── ADVANCED ───────────────────────────────────────
  {
    id: "bst",
    level: "advanced",
    category: "Data Structures",
    title: "Binary Search Tree",
    explanation:
      "A BST is a tree where each node's left children are smaller and right children are larger. This property enables O(log n) search, insert, and delete on average. BSTs are the basis for balanced trees like AVL and Red-Black trees.",
    realLifeExample:
      "An organizational chart where each manager delegates smaller tasks left and larger tasks right — you can quickly find any task by following the hierarchy.",
    operations: [
      "Insert — O(log n) average",
      "Search — O(log n) average",
      "Delete — O(log n) average",
      "Inorder traversal — O(n) gives sorted order",
    ],
    pythonCode: `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

def search(root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return search(root.left, val)
    return search(root.right, val)

def inorder(root):
    if root:
        inorder(root.left)
        print(root.val, end=" ")
        inorder(root.right)

root = None
for v in [50, 30, 70, 20, 40]:
    root = insert(root, v)
inorder(root)  # 20 30 40 50 70`,
    javaCode: `class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int v) { val = v; }
}

TreeNode insert(TreeNode root, int val) {
    if (root == null) return new TreeNode(val);
    if (val < root.val) root.left = insert(root.left, val);
    else root.right = insert(root.right, val);
    return root;
}

TreeNode search(TreeNode root, int val) {
    if (root == null || root.val == val) return root;
    if (val < root.val) return search(root.left, val);
    return search(root.right, val);
}

void inorder(TreeNode root) {
    if (root != null) {
        inorder(root.left);
        System.out.print(root.val + " ");
        inorder(root.right);
    }
}`,
    complexity: {
      time: "O(log n) average",
      space: "O(n)",
      bestCase: "O(log n) — balanced tree",
      worstCase: "O(n) — degenerate/skewed tree",
    },
    diagram: TREE_DIAGRAM,
  },
  {
    id: "graph-bfs-dfs",
    level: "advanced",
    category: "Graph Algorithms",
    title: "Graph — BFS & DFS",
    explanation:
      "A graph consists of vertices (nodes) and edges connecting them. BFS (Breadth-First Search) explores level by level using a queue. DFS (Depth-First Search) explores as deep as possible before backtracking using a stack/recursion. Both are fundamental for pathfinding, cycle detection, and network analysis.",
    realLifeExample:
      "BFS: finding the shortest route on a subway map by checking all stations one stop away first. DFS: exploring a maze by going as deep as possible before backtracking.",
    operations: [
      "BFS — O(V+E) using queue",
      "DFS — O(V+E) using stack/recursion",
      "Build adjacency list",
      "Track visited nodes",
    ],
    pythonCode: `from collections import deque

# Adjacency list representation
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D'],
    'C': ['A', 'D'],
    'D': ['B', 'C']
}

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    while queue:
        node = queue.popleft()
        print(node, end=" ")
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

def dfs(graph, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    print(node, end=" ")
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

print("BFS:"); bfs(graph, 'A')  # A B C D
print("DFS:"); dfs(graph, 'A')  # A B D C`,
    javaCode: `import java.util.*;

Map<String, List<String>> graph = new HashMap<>();
graph.put("A", Arrays.asList("B","C"));
graph.put("B", Arrays.asList("A","D"));
graph.put("C", Arrays.asList("A","D"));
graph.put("D", Arrays.asList("B","C"));

// BFS
void bfs(String start) {
    Set<String> visited = new HashSet<>();
    Queue<String> queue = new LinkedList<>();
    visited.add(start);
    queue.add(start);
    while (!queue.isEmpty()) {
        String node = queue.poll();
        System.out.print(node + " ");
        for (String n : graph.get(node)) {
            if (!visited.contains(n)) {
                visited.add(n);
                queue.add(n);
            }
        }
    }
}

// DFS
void dfs(String node, Set<String> visited) {
    visited.add(node);
    System.out.print(node + " ");
    for (String n : graph.get(node)) {
        if (!visited.contains(n)) dfs(n, visited);
    }
}`,
    complexity: {
      time: "O(V + E)",
      space: "O(V)",
      bestCase: "O(1) — target is start node",
      worstCase: "O(V + E) — must visit all vertices and edges",
    },
    diagram: GRAPH_DIAGRAM,
  },
  {
    id: "merge-sort",
    level: "advanced",
    category: "Sorting",
    title: "Merge Sort",
    explanation:
      "Merge sort is a divide-and-conquer algorithm that splits the array in half, recursively sorts each half, then merges them back in sorted order. It guarantees O(n log n) time complexity regardless of input, making it very reliable.",
    realLifeExample:
      "Sorting a deck of cards by splitting it in half, sorting each half separately, then merging the two sorted halves by comparing top cards.",
    operations: [
      "Divide array in half",
      "Recursively sort each half",
      "Merge sorted halves",
      "Compare and combine",
    ],
    pythonCode: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

data = [38, 27, 43, 3, 9, 82, 10]
print(merge_sort(data))`,
    javaCode: `public static void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}

static void merge(int[] arr, int l, int m, int r) {
    int[] left = Arrays.copyOfRange(arr, l, m + 1);
    int[] right = Arrays.copyOfRange(arr, m + 1, r + 1);
    int i = 0, j = 0, k = l;
    while (i < left.length && j < right.length)
        arr[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.length) arr[k++] = left[i++];
    while (j < right.length) arr[k++] = right[j++];
}`,
    complexity: {
      time: "O(n log n)",
      space: "O(n)",
      bestCase: "O(n log n)",
      worstCase: "O(n log n)",
    },
    diagram: ARR(["3", "9", "10", "27", "38", "43", "82"]),
  },
  {
    id: "quick-sort",
    level: "advanced",
    category: "Sorting",
    title: "Quick Sort",
    explanation:
      "Quick sort picks a pivot element and partitions the array so elements smaller than pivot go left and larger go right. It then recursively sorts the partitions. Average O(n log n) and often faster than merge sort in practice due to better cache performance.",
    realLifeExample:
      "Organizing books by picking one (pivot) and putting smaller-titled books on the left shelf and larger on the right, then repeating for each shelf.",
    operations: [
      "Choose pivot",
      "Partition around pivot",
      "Recursively sort left partition",
      "Recursively sort right partition",
    ],
    pythonCode: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

data = [10, 7, 8, 9, 1, 5]
print(quick_sort(data))  # [1, 5, 7, 8, 9, 10]`,
    javaCode: `public static void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

static int partition(int[] arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int t = arr[i]; arr[i] = arr[j]; arr[j] = t;
        }
    }
    int t = arr[i+1]; arr[i+1] = arr[high]; arr[high] = t;
    return i + 1;
}`,
    complexity: {
      time: "O(n log n) average",
      space: "O(log n)",
      bestCase: "O(n log n)",
      worstCase: "O(n²) — already sorted with bad pivot",
    },
    diagram: ARR(["1", "5", "7", "8", "9", "10"]),
  },
  {
    id: "dynamic-programming",
    level: "advanced",
    category: "Concepts",
    title: "Dynamic Programming",
    explanation:
      "Dynamic Programming (DP) solves complex problems by breaking them into overlapping subproblems and storing results to avoid redundant computation. Two approaches: top-down (memoization) and bottom-up (tabulation). It transforms exponential-time recursion into polynomial-time solutions.",
    realLifeExample:
      "Planning a road trip — instead of recalculating the best route from every city, you save the best route from each city you've already computed.",
    operations: [
      "Identify overlapping subproblems",
      "Define recurrence relation",
      "Memoize (top-down) or tabulate (bottom-up)",
      "Build solution from subproblem results",
    ],
    pythonCode: `# Fibonacci with memoization (top-down)
def fib_memo(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Fibonacci with tabulation (bottom-up)
def fib_tab(n):
    if n <= 1: return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

print(fib_memo(10))  # 55
print(fib_tab(10))   # 55

# 0/1 Knapsack
def knapsack(W, weights, values, n):
    dp = [[0]*(W+1) for _ in range(n+1)]
    for i in range(1, n+1):
        for w in range(1, W+1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w],
                    values[i-1] + dp[i-1][w-weights[i-1]])
            else:
                dp[i][w] = dp[i-1][w]
    return dp[n][W]`,
    javaCode: `// Fibonacci with tabulation
public static int fib(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++)
        dp[i] = dp[i-1] + dp[i-2];
    return dp[n];
}

// 0/1 Knapsack
public static int knapsack(int W, int[] wt, int[] val, int n) {
    int[][] dp = new int[n+1][W+1];
    for (int i = 1; i <= n; i++) {
        for (int w = 1; w <= W; w++) {
            if (wt[i-1] <= w)
                dp[i][w] = Math.max(dp[i-1][w],
                    val[i-1] + dp[i-1][w - wt[i-1]]);
            else
                dp[i][w] = dp[i-1][w];
        }
    }
    return dp[n][W];
}`,
    complexity: {
      time: "O(n) fibonacci, O(n*W) knapsack",
      space: "O(n) to O(n*W)",
      bestCase: "O(n)",
      worstCase: "O(n*W) for knapsack",
    },
    diagram: `<svg viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg"><text x="10" y="15" fill="#ffd60a" font-size="10" font-family="monospace">DP Table — Fibonacci</text>${["0", "1", "1", "2", "3", "5", "8"].map((v, i) => `<rect x="${i * 42 + 10}" y="25" width="36" height="28" rx="4" fill="${i < 2 ? "#30d158" : "#3b8beb"}" opacity="0.8"/><text x="${i * 42 + 28}" y="44" text-anchor="middle" fill="#fff" font-size="11" font-family="monospace">${v}</text><text x="${i * 42 + 28}" y="68" text-anchor="middle" fill="#9999b0" font-size="9" font-family="monospace">[${i}]</text>`).join("")}</svg>`,
  },
];
