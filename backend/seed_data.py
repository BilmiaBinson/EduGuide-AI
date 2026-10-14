"""
Pre-packaged W3Schools Python tutorial seed content.
Provides immediate grounding with real W3Schools tutorials, code examples,
and verified source URLs so EduGuide AI works out of the box even before
the user imports their full Colab collection.
"""

from typing import List, Dict, Any

SEED_DOCUMENTS: List[Dict[str, Any]] = [
    {
        "id": "w3s_python_intro_01",
        "title": "Python Introduction",
        "url": "https://www.w3schools.com/python/python_intro.asp",
        "content": (
            "Python is a popular programming language. It was created by Guido van Rossum, and released in 1991.\n"
            "It is used for: web development (server-side), software development, mathematics, system scripting.\n\n"
            "What can Python do?\n"
            "- Python can be used on a server to create web applications.\n"
            "- Python can be used alongside software to create workflows.\n"
            "- Python can connect to database systems. It can also read and modify files.\n"
            "- Python can be used to handle big data and perform complex mathematics.\n"
            "- Python can be used for rapid prototyping, or for production-ready software development."
        )
    },
    {
        "id": "w3s_python_why_learn_02",
        "title": "Why Learn Python?",
        "url": "https://www.w3schools.com/python/python_intro.asp",
        "content": (
            "Why Python is easy to learn and popular:\n"
            "- Python works on different platforms (Windows, Mac, Linux, Raspberry Pi, etc).\n"
            "- Python has a simple syntax similar to the English language.\n"
            "- Python has syntax that allows developers to write programs with fewer lines than some other programming languages.\n"
            "- Python runs on an interpreter system, meaning that code can be executed as soon as it is written. This means that prototyping can be very quick.\n"
            "- Python can be treated in a procedural way, an object-oriented way or a functional way."
        )
    },
    {
        "id": "w3s_python_syntax_indentation_03",
        "title": "Python Syntax and Indentation",
        "url": "https://www.w3schools.com/python/python_syntax.asp",
        "content": (
            "Python Indentation:\n"
            "Indentation refers to the spaces at the beginning of a code line.\n"
            "Where in other programming languages the indentation in code is for readability only, the indentation in Python is very important.\n"
            "Python uses indentation to indicate a block of code.\n\n"
            "Example:\n"
            "if 5 > 2:\n"
            "    print(\"Five is greater than two!\")\n\n"
            "Python will give you an IndentationError syntax error if you skip the indentation:\n"
            "if 5 > 2:\n"
            "print(\"Five is greater than two!\") # Syntax Error!\n\n"
            "The number of spaces is up to you as a programmer, the most common use is four, but it has to be at least one.\n"
            "You have to use the same number of spaces in the same block of code, otherwise Python will give you an error."
        )
    },
    {
        "id": "w3s_python_variables_04",
        "title": "Python Variables",
        "url": "https://www.w3schools.com/python/python_variables.asp",
        "content": (
            "Variables are containers for storing data values.\n"
            "Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.\n\n"
            "Example:\n"
            "x = 5\n"
            "y = \"John\"\n"
            "print(x)\n"
            "print(y)\n\n"
            "Variables do not need to be declared with any particular type, and can even change type after they have been set.\n"
            "Casting:\n"
            "If you want to specify the data type of a variable, this can be done with casting:\n"
            "x = str(3)    # x will be '3'\n"
            "y = int(3)    # y will be 3\n"
            "z = float(3)  # z will be 3.0"
        )
    },
    {
        "id": "w3s_python_datatypes_05",
        "title": "Python Data Types",
        "url": "https://www.w3schools.com/python/python_datatypes.asp",
        "content": (
            "Python has the following data types built-in by default, in these categories:\n"
            "- Text Type: str\n"
            "- Numeric Types: int, float, complex\n"
            "- Sequence Types: list, tuple, range\n"
            "- Mapping Type: dict\n"
            "- Set Types: set, frozenset\n"
            "- Boolean Type: bool\n"
            "- Binary Types: bytes, bytearray, memoryview\n"
            "- None Type: NoneType\n\n"
            "You can get the data type of any object by using the type() function:\n"
            "x = 5\n"
            "print(type(x)) # <class 'int'>"
        )
    },
    {
        "id": "w3s_python_conditions_06",
        "title": "Python Conditions and If statements",
        "url": "https://www.w3schools.com/python/python_conditions.asp",
        "content": (
            "Python supports the usual logical conditions from mathematics:\n"
            "- Equals: a == b\n"
            "- Not Equals: a != b\n"
            "- Less than: a < b\n"
            "- Less than or equal to: a <= b\n"
            "- Greater than: a > b\n"
            "- Greater than or equal to: a >= b\n\n"
            "These conditions can be used in several ways, most commonly in 'if statements' and loops.\n"
            "An 'if statement' is written by using the if keyword.\n\n"
            "Example with elif and else:\n"
            "a = 200\n"
            "b = 33\n"
            "if b > a:\n"
            "    print(\"b is greater than a\")\n"
            "elif a == b:\n"
            "    print(\"a and b are equal\")\n"
            "else:\n"
            "    print(\"a is greater than b\")"
        )
    },
    {
        "id": "w3s_python_loops_07",
        "title": "Python For and While Loops",
        "url": "https://www.w3schools.com/python/python_for_loops.asp",
        "content": (
            "Python has two primitive loop commands: while loops and for loops.\n\n"
            "While Loop:\n"
            "With the while loop we can execute a set of statements as long as a condition is true.\n"
            "i = 1\n"
            "while i < 6:\n"
            "    print(i)\n"
            "    i += 1\n\n"
            "For Loop:\n"
            "A for loop is used for iterating over a sequence (that is either a list, a tuple, a dictionary, a set, or a string).\n"
            "fruits = [\"apple\", \"banana\", \"cherry\"]\n"
            "for x in fruits:\n"
            "    print(x)\n\n"
            "The break statement can stop the loop before it has looped through all items.\n"
            "The continue statement can stop the current iteration of the loop, and continue with the next."
        )
    },
    {
        "id": "w3s_python_functions_08",
        "title": "Python Functions",
        "url": "https://www.w3schools.com/python/python_functions.asp",
        "content": (
            "A function is a block of code which only runs when it is called.\n"
            "You can pass data, known as parameters, into a function. A function can return data as a result.\n\n"
            "Creating a Function:\n"
            "In Python a function is defined using the def keyword:\n"
            "def my_function():\n"
            "    print(\"Hello from a function\")\n\n"
            "Calling a Function:\n"
            "To call a function, use the function name followed by parenthesis:\n"
            "my_function()\n\n"
            "Arguments:\n"
            "Information can be passed into functions as arguments.\n"
            "def greet(fname):\n"
            "    print(\"Hello \" + fname)\n\n"
            "Return Values:\n"
            "To let a function return a value, use the return statement:\n"
            "def add(x, y):\n"
            "    return x + y"
        )
    }
]

def get_seed_documents() -> List[Dict[str, Any]]:
    return SEED_DOCUMENTS
