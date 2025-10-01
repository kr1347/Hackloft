const problemData = [
    {
        title: "Hello World Program",
        description: "Write a Python program that prints 'Hello, World!'.",
        sampleInput: "N/A",
        sampleOutput: "Hello, World!",
        difficulty: "Easy",
        tags: ["Basics", "Python"],
        solution: `# Write your Python code here 
        print("Hello, World!")`
    }
    ,
    {
        title: "Remove Outermost Parentheses",
    description: "Given a valid parentheses string s, remove the outermost parentheses of every primitive valid parentheses string in its decomposition and return the resulting string.",
    sampleInput: "(()())(())",
    sampleOutput: "()()()",
    difficulty: "Medium",
    solution: 
    `def removeOuterParentheses(s):
    result = []
     balance = 0
     
     for char in s:
             if char == '(':
 if balance > 0:
   result.append(char)
      balance += 1
       elif char == ')':
 balance -= 1
if balance > 0:
result.append(char)
 return ''.join(result)
 # Example usage print(removeOuterParentheses('(()())(())'))  # Output: '()()()'`,


    }
];
