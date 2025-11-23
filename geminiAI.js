const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, ".env")
});

async function geminit(prompt){
    const {GoogleGenerativeAI}= await import("@google/generative-ai");
    const genAI= new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model= genAI.getGenerativeModel({
        model: "gemini-2.5-flash",

    });
    const result=await model.generateContent(prompt);
    return result.response.text();
}
async function GenerateDoc(code) {
    const prompt=`You are a senior developer who has to write the documentation for the code so write the document for the given code in clean and understandable way. directly start giving doc directly in detail 
    code:
    ${code}`;
    const result= await geminit(prompt);
    return result;

}

async function addcomments(code){
    const prompt=`You are a senior software engineer.
    Your task:
    - Automatically detect the programming language of the provided code.
    - Add minimal, high-value comments ONLY where needed.
    - Do NOT change variable names.
    - Do NOT change formatting.
    - Do NOT rewrite functions unless absolutely required.
    - Do NOT add explanations outside the code.
    - Do NOT add markdown.
    - ONLY return the final commented code.

    Commenting rules:
    - Add short comments for logic steps.
    - Add one-line summaries before functions.
    - Avoid over-commenting obvious lines.
    - Comments must match the language (//, #, /* */, etc).

    Return only the fully commented code.
    ${code}`;
    const result=await geminit(prompt);
    return result;
}

async function livecode(usercode,linepre) {
    const prompt=`You are an AI coding assistant.
                    Based on the following code, suggest the next meaningful code snippet.
                    Return ONLY the code snippet with no explanations.

                    Current file:
                    ${usercode}

                    Cursor line: ${linepre}`
    const result=await geminit(prompt);
    return result;
}
async function fixAndOptimize(code) {
    const prompt = `
        You are a senior software engineer.
        Your tasks:
        - Fix any syntax or logical errors in the provided code.
        - Optimize the code for readability and performance.
        - Keep the original structure (same function breakdown, same flow).
        - Do NOT change variable names unless required to fix errors.
        - Do NOT add extra comments.
        - Do NOT rewrite the code in a different style.
        - Only output the corrected code.
        Code:
        ${code}
        `;
            const result = await geminit(prompt);
            return result;
}
async function debuggers(code, diagnostics) {
    const prompt = `You are an AI debugging assistant.
        Your tasks:
        1. Read the given code and VS Code diagnostics (errors & warnings).
        2. Explain each error clearly.
        3. Provide the FIX for each issue.
        4. Provide a corrected version of the code at the end.
        5. Do NOT change the overall structure or naming unless required to fix errors.
        code:
        ${code}
        Diagnostics:
        ${diagnostics.map(d =>`${d.message} (line: ${d.range.start.line + 1})`).join("\n")}
        `;
    const result= await geminit(prompt);
    return result;
}
async function getexplain(line){
    const prompt=` Explanation for: \`${line}\`
                    What it does: 
                    Describes the purpose of the line.
                    Complexity:  
                    Time: O(1), Space: O(1)
                    Side effects:  
                    Any state changes this line causes.
                    Security implications:  
                    Any unsafe patterns or risks.`;
    const result=await geminit(prompt);
    return result;
}
module.exports={ GenerateDoc,addcomments,livecode,fixAndOptimize,debuggers,getexplain };