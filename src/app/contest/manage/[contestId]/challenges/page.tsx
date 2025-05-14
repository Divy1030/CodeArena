"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";

enum DifficultyEnum {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

function Page() {
  const params = useParams();
  const contestId = params?.contestId as string;

  // Add all required fields
  const [title, setTitle] = useState("");
  const [statement, setStatement] = useState("");
  const [inputFormat, setInputFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState("");
  const [constraints, setConstraints] = useState("");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [explanation, setExplanation] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyEnum | "">("");
  const [tags, setTags] = useState("");
  const [testCaseInput, setTestCaseInput] = useState("");
  const [testCaseOutput, setTestCaseOutput] = useState("");
  const [testCaseExplanation, setTestCaseExplanation] = useState("");
  const [timeLimit, setTimeLimit] = useState("");
  const [memoryLimit, setMemoryLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/contest/add-problems/${contestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          statement,
          inputFormat,
          outputFormat,
          constraints,
          sampleInput,
          sampleOutput,
          explanation,
          difficulty,
          tags: tags.split(",").map((tag) => tag.trim()),
          testCaseInput,
          testCaseOutput,
          testCaseExplanation,
          timeLimit,
          memoryLimit,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Problem added successfully!");
        setTitle("");
        setStatement("");
        setInputFormat("");
        setOutputFormat("");
        setConstraints("");
        setSampleInput("");
        setSampleOutput("");
        setExplanation("");
        setDifficulty("");
        setTags("");
        setTestCaseInput("");
        setTestCaseOutput("");
        setTestCaseExplanation("");
        setTimeLimit("");
        setMemoryLimit("");
      } else {
        setMessage(data.message || "Failed to add problem.");
      }
    } catch (err) {
      setMessage("Error adding problem.");
    } finally {
      setLoading(false);
    }
  };

  // Only allow numbers for timeLimit and memoryLimit
  const handleNumberInput = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setter(value);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white flex flex-col items-center justify-center py-10">
      <div className="bg-[#1e293b]/90 rounded-2xl shadow-2xl p-10 w-full max-w-6xl overflow-y-auto max-h-[90vh] border border-blue-800">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-400 tracking-wide">Add Problem to Contest</h2>
        <form onSubmit={handleAddProblem} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <input className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" placeholder="Statement" value={statement} onChange={e => setStatement(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]" placeholder="Input Format" value={inputFormat} onChange={e => setInputFormat(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]" placeholder="Output Format" value={outputFormat} onChange={e => setOutputFormat(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]" placeholder="Constraints" value={constraints} onChange={e => setConstraints(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]" placeholder="Sample Input" value={sampleInput} onChange={e => setSampleInput(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]" placeholder="Sample Output" value={sampleOutput} onChange={e => setSampleOutput(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-4">
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]" placeholder="Explanation" value={explanation} onChange={e => setExplanation(e.target.value)} />
            <select
              className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={difficulty}
              onChange={e => setDifficulty(e.target.value as DifficultyEnum)}
              required
            >
              <option value="">Select Difficulty</option>
              <option value={DifficultyEnum.easy}>easy</option>
              <option value={DifficultyEnum.medium}>medium</option>
              <option value={DifficultyEnum.hard}>hard</option>
            </select>
            <input className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]" placeholder="Test Case Input" value={testCaseInput} onChange={e => setTestCaseInput(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]" placeholder="Test Case Output" value={testCaseOutput} onChange={e => setTestCaseOutput(e.target.value)} required />
            <textarea className="p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px]" placeholder="Test Case Explanation" value={testCaseExplanation} onChange={e => setTestCaseExplanation(e.target.value)} />
            <div className="flex gap-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="flex-1 p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Time Limit (ms)"
                value={timeLimit}
                onChange={handleNumberInput(setTimeLimit)}
                required
              />
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="flex-1 p-3 bg-[#2e3b4e] text-white rounded-lg border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Memory Limit (MB)"
                value={memoryLimit}
                onChange={handleNumberInput(setMemoryLimit)}
                required
              />
            </div>
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Adding...
                </span>
              ) : "Add Problem"}
            </button>
            {message && (
              <div className={`mt-4 text-center font-semibold ${message.includes("success") ? "text-green-400" : "text-red-400"}`}>
                {message}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Page;