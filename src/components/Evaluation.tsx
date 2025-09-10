import React, { useRef } from "react";

function Questionnaire() {
  const questionsRef = useRef([
    {
        id:"1",
        problem:"Sadness",
    options:[
      "I do not feel sad.",
      "I feel sad.",
      "I am sad all the time and I can't snap out of it.",
      "I am so sad and unhappy that I can't stand it."
    ]
    },
    {
        id:"2",
        problem:"",
    options:[
      "I am not particularly discouraged about the future.",
      "I feel discouraged about the future.",
      "I feel I have nothing to look forward to.",
      "I feel the future is hopeless and that things cannot improve."
    ]
    },
    {
        id:"3",
        problem:"",
    options:[
      "I do not feel like a failure.",
      "I feel I have failed more than the average person.",
      "As I look back on my life, all I can see is a lot of failures.",
      "I feel I am a complete failure as a person."
    ]
    },
    {
        id:"4",
        problem:"",
    options:    [
      "I get as much satisfaction out of things as I used to.",
      "I don't enjoy things the way I used to.",
      "I don't get real satisfaction out of anything anymore.",
      "I am dissatisfied or bored with everything."
    ]
    },
    {
        id:"5",
        problem:"",
    options:[
      "I don't feel particularly guilty.",
      "I feel guilty a good part of the time.",
      "I feel quite guilty most of the time.",
      "I feel guilty all of the time."
    ]},
    {
        id:"6",
        problem:"",
    options:[
      "I don't feel I am being punished.",
      "I feel I may be punished.",
      "I expect to be punished.",
      "I feel I am being punished."
    ]},
    {
        id:"7",
        problem:"",
    options:[
      "I don't feel disappointed in myself.",
      "I am disappointed in myself.",
      "I am disgusted with myself.",
      "I hate myself."
    ]},
    {
        id:"8",
        problem:"",
    options:[
      "I don't feel I am any worse than anybody else.",
      "I am critical of myself for my weaknesses or mistakes.",
      "I blame myself all the time for my faults.",
      "I blame myself for everything bad that happens."
    ]},
    {
        id:"9",
        problem:"",
    options:[
      "I don't have any thoughts of killing myself.",
      "I have thoughts of killing myself, but I would not carry them out.",
      "I would like to kill myself.",
      "I would kill myself if I had the chance."
    ]},
    {
        id:"10",
        problem:"",
    options:[
      "I don't cry any more than usual.",
      "I cry more now than I used to.",
      "I cry all the time now.",
      "I used to be able to cry, but now I can't cry even though I want to."
    ]},
    {
        id:"11",
        problem:"",
    options:[
      "I am no more irritated by things than I ever was.",
      "I am slightly more irritated now than usual.",
      "I am quite annoyed or irritated a good deal of the time.",
      "I feel irritated all the time."
    ]},
    {
        id:"12",
        problem:"",
    options:[
      "I have not lost interest in other people.",
      "I am less interested in other people than I used to be.",
      "I have lost most of my interest in other people.",
      "I have lost all of my interest in other people."
    ]},
    {
        id:"13",
        problem:"",
    options:[
      "I make decisions about as well as I ever could.",
      "I put off making decisions more than I used to.",
      "I have greater difficulty in making decisions more than I used to.",
      "I can't make decisions at all anymore."
    ]},
    {
        id:"14",
        problem:"",
    options:[
      "I don't feel that I look any worse than I used to.",
      "I am worried that I am looking old or unattractive.",
      "I feel there are permanent changes in my appearance that make me look unattractive.",
      "I believe that I look ugly."
    ]},
    {
        id:"15",
        problem:"",
    options:[
      "I can work about as well as before.",
      "It takes an extra effort to get started at doing something.",
      "I have to push myself very hard to do anything.",
      "I can't do any work at all."
    ]},
    {
        id:"16",
        problem:"",
    options:[
      "I can sleep as well as usual.",
      "I don't sleep as well as I used to.",
      "I wake up 1-2 hours earlier than usual and find it hard to get back to sleep.",
      "I wake up several hours earlier than I used to and cannot get back to sleep."
    ]},
    {
        id:"17",
        problem:"",
    options:[
      "I don't get more tired than usual.",
      "I get tired more easily than I used to.",
      "I get tired from doing almost anything.",
      "I am too tired to do anything."
    ]},
    {
        id:"18",
        problem:"",
    options:[
      "My appetite is no worse than usual.",
      "My appetite is not as good as it used to be.",
      "My appetite is much worse now.",
      "I have no appetite at all anymore."
    ]},
    {
        id:"19",
        problem:"",
    options:[
      "I haven't lost much weight, if any, lately.",
      "I have lost more than five pounds.",
      "I have lost more than ten pounds.",
      "I have lost more than fifteen pounds."
    ]}
  ]);

   return (
    <div>
      <h1>Evaluation</h1>
      {questionsRef.current.map((question, qIndex) => (
        <div key={question.id}>
          <p>
            <strong>Question {qIndex + 1}:</strong>{" "}
            {question.problem || "Untitled Problem"}
          </p>
          {question.options.map((option, oIndex) => (
            <label key={oIndex} style={{ display: "block" }}>
              <input
                type="radio"
                name={`q${qIndex}`}
                value={oIndex}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
export default Questionnaire;