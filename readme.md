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
