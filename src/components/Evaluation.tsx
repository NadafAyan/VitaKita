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
        problem:"Discourageous?",
    options:[
      "I am not particularly discouraged about the future.",
      "I feel discouraged about the future.",
      "I feel I have nothing to look forward to.",
      "I feel the future is hopeless and that things cannot improve."
    ]
    },
    {
        id:"3",
        problem:"I do not feel like a failure",
    options:[
      "I do not feel like a failure.",
      "I feel I have failed more than the average person.",
      "As I look back on my life, all I can see is a lot of failures.",
      "I feel I am a complete failure as a person."
    ]
    },
    {
        id:"4",
        problem:"I get as much satisfaction out of things as I used to",
    options:    [
      "I get as much satisfaction out of things as I used to.",
      "I don't enjoy things the way I used to.",
      "I don't get real satisfaction out of anything anymore.",
      "I am dissatisfied or bored with everything."
    ]
    },
    {
        id:"5",
        problem:"I don't feel particularly guilty.",
    options:[
      "I don't feel particularly guilty.",
      "I feel guilty a good part of the time.",
      "I feel quite guilty most of the time.",
      "I feel guilty all of the time."
    ]},
    {
        id:"6",
        problem:"I don't feel I am being punished",
    options:[
      "I don't feel I am being punished.",
      "I feel I may be punished.",
      "I expect to be punished.",
      "I feel I am being punished."
    ]},
    {
        id:"7",
        problem:"why you feel disappointed?",
    options:[
      "I don't feel disappointed in myself.",
      "I am disappointed in myself.",
      "I am disgusted with myself.",
      "I hate myself."
    ]},
    {
        id:"8",
        problem:"I don't feel I am any worse than anybody else",
    options:[
      "I don't feel I am any worse than anybody else.",
      "I am critical of myself for my weaknesses or mistakes.",
      "I blame myself all the time for my faults.",
      "I blame myself for everything bad that happens."
    ]},
    {
        id:"9",
        problem:"I don't have any thoughts of killing myself",
    options:[
      "I don't have any thoughts of killing myself.",
      "I have thoughts of killing myself, but I would not carry them out.",
      "I would like to kill myself.",
      "I would kill myself if I had the chance."
    ]},
    {
        id:"10",
        problem:"I don't cry any more than usual",
    options:[
      "I don't cry any more than usual.",
      "I cry more now than I used to.",
      "I cry all the time now.",
      "I used to be able to cry, but now I can't cry even though I want to."
    ]},
    {
        id:"11",
        problem:"I am no more irritated by things than I ever was",
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
        problem:"I make decisions about as well as I ever could",
    options:[
      "I make decisions about as well as I ever could.",
      "I put off making decisions more than I used to.",
      "I have greater difficulty in making decisions more than I used to.",
      "I can't make decisions at all anymore."
    ]},
    {
        id:"14",
        problem:"Are you not happy with yourself?",
    options:[
      "I don't feel that I look any worse than I used to.",
      "I am worried that I am looking old or unattractive.",
      "I feel there are permanent changes in my appearance that make me look unattractive.",
      "I believe that I look ugly."
    ]},
    {
        id:"15",
        problem:"I can work about as well as before",
    options:[
      "I can work about as well as before.",
      "It takes an extra effort to get started at doing something.",
      "I have to push myself very hard to do anything.",
      "I can't do any work at all."
    ]},
    {
        id:"16",
        problem:"I can sleep as well as usual.",
    options:[
      "I can sleep as well as usual.",
      "I don't sleep as well as I used to.",
      "I wake up 1-2 hours earlier than usual and find it hard to get back to sleep.",
      "I wake up several hours earlier than I used to and cannot get back to sleep."
    ]},
    {
        id:"17",
        problem:"Are you tired ?",
    options:[
      "I don't get more tired than usual.",
      "I get tired more easily than I used to.",
      "I get tired from doing almost anything.",
      "I am too tired to do anything."
    ]},
    {
        id:"18",
        problem:"My appetite is no worse than usual",
    options:[
      "My appetite is no worse than usual.",
      "My appetite is not as good as it used to be.",
      "My appetite is much worse now.",
      "I have no appetite at all anymore."
    ]},
    {
        id:"19",
        problem:"I haven't lost much weight, if any, lately",
    options:[
      "I haven't lost much weight, if any, lately.",
      "I have lost more than five pounds.",
      "I have lost more than ten pounds.",
      "I have lost more than fifteen pounds."
    ]},
    {
      id:"20",
    problem:"How often do you feel overwhelmed by stress or daily responsibilities?",
    options:[
             "Never",
             "Sometimes",
             "Often",
            "Almost always",

      ]
    },
    {
    id: "21",
    problem: "How would you describe the quality of your sleep over the past month?",
    options: [
      "Very good – I wake up refreshed", 
      "Fair – I sometimes wake up tired", 
      "Poor – I often wake up tired", 
      "Very poor – I rarely feel rested"]
  },
  {
    id: "22",
    problem: "Do you frequently lose interest in activities you once enjoyed?",
    options: [
      "Never", 
      "Occasionally", 
      "Frequently", 
      "Almost all the time"
    ]
  },
  {
    id: "23",
    problem: "How often do you experience difficulty concentrating (work, study, daily tasks)?",
    options: [
      "Rarely", 
      "Sometimes", 
      "Often", 
      "Almost every day"]
  },
  {
    id: "24",
    problem: "How often do you feel anxious, nervous, or on edge?",
    options: ["Never", "Occasionally", "Frequently", "Nearly all the time"]
  },
  {
    id: "25",
    problem: "How would you describe your energy level during the day?",
    options: [
      "High – I feel active most of the day", 
      "Moderate – I feel okay but get tired sometimes", 
      "Low – I feel tired often", 
      "Very low – I struggle to stay active"]
  },
  {
    id: "26",
    problem: "How often do you feel socially withdrawn or prefer to isolate yourself?",
    options: ["Never", "Sometimes", "Often", "Always"]
  },
  {
    id: "27",
    problem: "Do you have persistent negative thoughts about yourself (e.g., 'I am worthless')?",
    options: ["Never", "Occasionally", "Frequently", "Almost always"]
  },
  {
    id: "28",
    problem: "How often do you experience sudden mood changes (e.g., happy → sad, calm → angry)?",
    options: [
      "Rarely", 
      "Sometimes", 
      "Often", 
      "Very often"]
  },
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