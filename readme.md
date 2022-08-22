    ███████╗ ██████╗██████╗ ██╗     
    ██╔════╝██╔════╝██╔══██╗██║     
    █████╗  ██║     ██████╔╝██║     
    ██╔══╝  ██║     ██╔═══╝ ██║     
    ██║     ╚██████╗██║     ███████╗
    ╚═╝      ╚═════╝╚═╝     ╚══════╝
                                    
# Functional Computer Programming Language

- [Navigation](#functional-computer-programming-language)
    - [Overview](#overview)
    - [Examples](#examples)
    - [Getting Started](#getting-started)
## Overview
fcpl is an [expression-based](https://en.wikipedia.org/wiki/Expression-oriented_programming_language), [dynamic](https://en.wikipedia.org/wiki/Dynamic_programming_language), [weakly typed](https://en.wikipedia.org/wiki/Strong_and_weak_typing), [functional programming language](https://en.wikipedia.org/wiki/Functional_programming) which [transpliles](https://en.wikipedia.org/wiki/Source-to-source_compiler) into JavaScript. Its syntax is inspired by [F#](https://en.wikipedia.org/wiki/F_Sharp_(programming_language)) and [CoffeeScript](https://en.wikipedia.org/wiki/CoffeeScript).

## Examples
Hello World Program
```dart
// import print from the standard library
Import <| "std.print"
// log "Hello, World!" to the console
"Hello, World!" |> Print
```
Factorial Program
```dart
// import the standard library
Import <| "std"

Fun <| (Fact, (x), {
    If <| ((x, 1) |> GreaterOrEqualTo, {
        (
            x, 
            ((x, 1) |> Difference) |> Fact
        ) |> Product |> Return
    }, {
        1 |> Return
    }) |> Return
})

For <| (10, (x), {
    (x) |> Fact |> Print
})
```

## Getting Started
fcpl source code consists of Variables, Literals and the Pipe Operator - No Exceptions.

### The Pipe Operator
The Pipe Operator `|>` is a versitile operator which is used to control the flow of state through function calls.
```Dart
// in other programming languages you might find the following:
Print("All your codebase are belong to us.")

// in fcpl you would write:
"All your codebase are belong to us." |> Print
```

fcpl also supports a left-facing Pipe Operator:
```Dart
Print <| "All your codebase are belong to us."
```
Any Literal, Variable or Expression can be passed through the Pipe Operator

### Literals
fcpl has 5 types of Literal values: String, Number, Collection, Pure Scope and Impure Scope.

Strings are wrapped in double quotes and behave identically to JavaScript Strings.
```Dart
"Hello, World!" |> Print
"Hello \n World!" |> Print
```

Numbers:
```Dart
10 |> Print
10.83 |> Print
```

Collections are wrapped in `()` brackets and are used to group data.
```Dart
(3,1,4,1,5,9) |> Print // Prints: [3, 1, 4, 1, 5, 9]
// they can contain different types of literals
("This is a string",1,4,1,"This too",9) |> Print
// they can contain other collections too
(("this is a nested collection", 99),1) |> Print
```

Pure Scopes contain immutable state and pure expressions and is wrapped in `{}` brackets.
```Dart
{
    "Printing from a pure scope." |> Print
}
```
You are not allowed to create impure state inside of a pure scope:
```Dart
// assign the Literal 10 to the Id 'impureValue' as a Variable
(impureValue, 10) |> ImpureAssign
{
    impureValue |> Print // creates a compile time error: you are not allowed to use impure state inside of a pure scope.
}
```
You also cant create impure state inside of a pure scope:
```Dart
{
    (impureValue, 10) |> ImpureAssign // creates a compile time error: you cant use ImpureAssign inside of a Pure Scope
}
```

Impure Scopes contain mutable and immutable state and impure or pure expressions. They are wrapped with `[]` brackets.

```Dart
[
    // declaring mutable, impure state
    (impureValue, 10) |> ImpureAssign
    impureValue |> Print
]
```

### Variables

Variables are a container for a Literal value. You can declare a variable through the `ImpureAssign`, `PureAssign`, or `Fun` built-in functions.

```Dart
// set 'variableName' to "variable value" as an impure, mutable variable
(variableName, "variable value") |> ImpureAssign
// set 'x' to 10 as a pure, immutable variable
(x, 10) |> PureAssign
```

Functions are also assigned to a variable.

```Dart
// set 'FunctionName' to a pure function which takes two arguments and returns 0
Fun <| (FunctionName, (functionParameter1, functionParameter2), {
    functionParameter1 |> Print
    functionParameter2 |> Print
    0 |> Return
})

// set 'ImpureFunctionName' to an impure function which takes two arguments and returns 0
// notice the `[]` brackets
Fun <| (ImpureFunctionName, (functionParameter1, functionParameter2), [
    functionParameter1 |> Print
    functionParameter2 |> Print
    0 |> Return
])
```