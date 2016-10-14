interface inputStream {
    read(size: number): string;
}

interface String {
    isWhiteSpace(): boolean;
    isAlphabet(): boolean;
}

String.prototype.isWhiteSpace = function () {
    return this == "\t" || this == " " || this == "\n" || this == "\r";
}

String.prototype.isAlphabet = function () {
    return /[a-zA-Z]/.test(this);
}


class lexer {
    in: inputStream;
    constructor(input: inputStream) {
        this.in = input;
    }

    tokens: token[] = []

    scan(): never {
        let peek: string;
        while (true) {
            peek = this.in.read(1);

            if (peek.isAlphabet()) {
                let currentLexem: string = "";
                while (peek.isAlphabet()) {
                    currentLexem += peek;
                    peek = this.in.read(1);
                }
                this.tokens.push(new token())
            }

        }
    }
}

enum tokenType {
    DIGIT,
    ALPHABET,
    STAR,
    OR,
    LEFT_PARENTHESIS,
    RIGHT_PARENTHESIS
}

class token {
    lexem: string;
    type: tokenType;
    constructor(lexem: string, type: tokenType) {
        this.lexem = lexem;
        this.type = type;
    }
}