"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
// import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { FaPlus, FaEdit, FaTrash, FaGripVertical } from "react-icons/fa";

enum DifficultyEnum {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}

interface Problem {
  _id: string;
  title: string;
  statement?: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleInput?: string;
  sampleOutput?: string;
  explanation?: string;
  difficulty: DifficultyEnum;
  tags: string[];
  timeLimit?: string;
  memoryLimit?: string;
  testCases?: {
    input?: string;
    output?: string;
    explanation?: string;
  }[];
}

function Page() {
  const params = useParams();
  const contestId = params?.contestId as string;

  // State for existing problems
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProblem, setIsAddingProblem] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

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
  
  // Fetch existing problems for this contest
  useEffect(() => {
    fetchProblems();
  }, [contestId]);

  // Function to fetch problems
  const fetchProblems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/contest/get-problems/${contestId}`);
      const data = await response.json();
      
      if (data.success) {
        setProblems(data.problems || []);
      } else {
        toast.error("Failed to load problems");
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Error loading problems");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form fields
  const resetForm = () => {
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
  };

  // Validate form before submission
  const validateForm = () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return false;
    }
    if (!statement.trim()) {
      toast.error("Statement is required");
      return false;
    }
    if (!inputFormat.trim()) {
      toast.error("Input format is required");
      return false;
    }
    if (!outputFormat.trim()) {
      toast.error("Output format is required");
      return false;
    }
    if (!constraints.trim()) {
      toast.error("Constraints are required");
      return false;
    }
    if (!sampleInput.trim()) {
      toast.error("Sample input is required");
      return false;
    }
    if (!sampleOutput.trim()) {
      toast.error("Sample output is required");
      return false;
    }
    if (!explanation.trim()) {
      toast.error("Explanation is required");
      return false;
    }
    if (!difficulty) {
      toast.error("Difficulty is required");
      return false;
    }
    if (!tags.trim()) {
      toast.error("At least one tag is required");
      return false;
    }
    if (!testCaseInput.trim()) {
      toast.error("Test case input is required");
      return false;
    }
    if (!testCaseOutput.trim()) {
      toast.error("Test case output is required");
      return false;
    }
    if (!timeLimit.trim()) {
      toast.error("Time limit is required");
      return false;
    }
    if (!memoryLimit.trim()) {
      toast.error("Memory limit is required");
      return false;
    }
    return true;
  };

  // Handle Add Problem
  const handleAddProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
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
          // Important: Ensure testCases is sent properly as an array of objects
          testCases: [
            {
              input: testCaseInput,
              output: testCaseOutput,
              explanation: testCaseExplanation || "No explanation provided"
            }
          ],
          timeLimit: parseInt(timeLimit),
          memoryLimit: parseInt(memoryLimit),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Problem added successfully!");
        resetForm();
        fetchProblems();
        setIsAddingProblem(false);
      } else {
        toast.error(data.message || "Failed to add problem.");
      }
    } catch (err) {
      console.error("Error adding problem:", err);
      toast.error("Error adding problem.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Problem
  const handleEditProblem = (problem: Problem) => {
    setSelectedProblem(problem);
    setIsEditing(true);
    
    // Set form fields to match the selected problem
    setTitle(problem.title);
    setStatement(problem.statement || "");
    setInputFormat(problem.inputFormat || "");
    setOutputFormat(problem.outputFormat || "");
    setConstraints(problem.constraints || "");
    setSampleInput(problem.sampleInput || "");
    setSampleOutput(problem.sampleOutput || "");
    setExplanation(problem.explanation || "");
    setDifficulty(problem.difficulty);
    setTags(problem.tags?.join(", ") || "");
    
    // Handle test cases correctly
    if (problem.testCases && problem.testCases.length > 0) {
      setTestCaseInput(problem.testCases[0]?.input || "");
      setTestCaseOutput(problem.testCases[0]?.output || "");
      setTestCaseExplanation(problem.testCases[0]?.explanation || "");
    }
    
    setTimeLimit(problem.timeLimit?.toString() || "");
    setMemoryLimit(problem.memoryLimit?.toString() || "");
    
    // Show form
    setIsAddingProblem(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    if (isEditing && selectedProblem) {
      handleUpdateProblem(e);
    } else {
      handleAddProblem(e);
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

  // Handle Update Problem
  const handleUpdateProblem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProblem) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/contest/update-problem/${contestId}/${selectedProblem._id}`, {
        method: "PUT",
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
          // Important: Ensure testCases is sent properly as an array of objects
          testCases: [
            {
              input: testCaseInput,
              output: testCaseOutput,
              explanation: testCaseExplanation || "No explanation provided"
            }
          ],
          timeLimit: parseInt(timeLimit),
          memoryLimit: parseInt(memoryLimit),
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        toast.success("Problem updated successfully!");
        resetForm();
        setIsAddingProblem(false);
        setIsEditing(false);
        setSelectedProblem(null);
        fetchProblems();
      } else {
        toast.error(data.message || "Failed to update problem.");
      }
    } catch (err) {
      console.error("Error updating problem:", err);
      toast.error("Error updating problem.");
    } finally {
      setLoading(false);
    }
  };

  // Handle Delete Problem
  const handleDeleteProblem = async (problemId: string) => {
    if (window.confirm("Are you sure you want to delete this problem?")) {
      try {
        const response = await fetch(`/api/contest/delete-problem/${contestId}/${problemId}`, {
          method: "DELETE",
        });
        const data = await response.json();
        
        if (data.success) {
          toast.success("Problem deleted successfully");
          setProblems(problems.filter(problem => problem._id !== problemId));
        } else {
          toast.error(data.message || "Failed to delete problem");
        }
      } catch (error) {
        console.error("Error deleting problem:", error);
        toast.error("Error deleting problem");
      }
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: DifficultyEnum) => {
    switch (difficulty) {
      case DifficultyEnum.easy:
        return "text-green-500";
      case DifficultyEnum.medium:
        return "text-yellow-500";
      case DifficultyEnum.hard:
        return "text-red-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <ProtectedRoute adminOnly={false}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-medium text-white mb-2">Contest Challenges</h2>
        <p className="text-gray-400 mb-8">
          Add challenges to your contest by selecting challenges from our library or create and add your own challenges. To reorder your challenges, simply select the challenge and then drag and drop to the desired location.
        </p>
        
        <div className="mb-6">
          {!isAddingProblem ? (
            <button 
              onClick={() => setIsAddingProblem(true)}
              className="px-4 py-2 bg-transparent border border-gray-600 hover:border-gray-500 text-gray-300 rounded-md flex items-center gap-2"
            >
              <FaPlus size={14} /> Add Challenge
            </button>
          ) : (
            <div className="bg-[#121B38] border border-gray-700 rounded-md p-6 mb-8">
              <h3 className="text-xl font-medium text-white mb-6">
                {isEditing ? "Edit Challenge" : "Add New Challenge"}
              </h3>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                    <input 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Statement</label>
                    <textarea 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                      value={statement}
                      onChange={e => setStatement(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Explanation</label>
                    <textarea 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                      value={explanation}
                      onChange={e => setExplanation(e.target.value)}
                      placeholder="Enter problem explanation"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Constraints</label>
                    <textarea 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                      value={constraints}
                      onChange={e => setConstraints(e.target.value)}
                      placeholder="Enter problem constraints"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Input Format</label>
                    <textarea 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                      value={inputFormat}
                      onChange={e => setInputFormat(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Output Format</label>
                    <textarea 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                      value={outputFormat}
                      onChange={e => setOutputFormat(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Sample Input</label>
                    <textarea 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                      value={sampleInput}
                      onChange={e => setSampleInput(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Sample Output</label>
                    <textarea 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                      value={sampleOutput}
                      onChange={e => setSampleOutput(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                {/* Third column of inputs */}
                <div className="flex flex-col gap-4 md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                      <select
                        className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value as DifficultyEnum)}
                        required
                      >
                        <option value="">Select</option>
                        <option value={DifficultyEnum.easy}>Easy</option>
                        <option value={DifficultyEnum.medium}>Medium</option>
                        <option value={DifficultyEnum.hard}>Hard</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Time Limit (ms)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={timeLimit}
                        onChange={handleNumberInput(setTimeLimit)}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Memory (MB)</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        value={memoryLimit}
                        onChange={handleNumberInput(setMemoryLimit)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                    <input 
                      className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="algorithms, data structures, etc."
                      value={tags}
                      onChange={e => setTags(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-md font-medium text-white mb-3">Test Cases</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Test Case Input</label>
                      <textarea 
                        className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                        value={testCaseInput}
                        onChange={e => setTestCaseInput(e.target.value)}
                        placeholder="Enter test case input data"
                        required
                      />
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Test Case Output</label>
                      <textarea 
                        className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[80px]"
                        value={testCaseOutput}
                        onChange={e => setTestCaseOutput(e.target.value)}
                        placeholder="Enter expected output for the test case"
                        required
                      />
                    </div>
                    
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-300 mb-1">Test Case Explanation (Optional)</label>
                      <textarea 
                        className="w-full p-2 bg-[#1e293b] text-white rounded border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[60px]"
                        value={testCaseExplanation}
                        onChange={e => setTestCaseExplanation(e.target.value)}
                        placeholder="Explain how the test case works (optional)"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3 justify-end mt-4">
                    <button 
                      type="button"
                      onClick={() => {
                        setIsAddingProblem(false);
                        setIsEditing(false);
                        setSelectedProblem(null);
                        resetForm();
                      }}
                      className="px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          {isEditing ? "Updating..." : "Saving..."}
                        </>
                      ) : isEditing ? "Update Challenge" : "Add Challenge"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
        
        {/* Problems List */}
        <div className="bg-[#121B38] border border-gray-700 rounded-md overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Loading problems...</p>
            </div>
          ) : problems.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No challenges have been added yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f172a] text-gray-300">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium w-8"></th>
                    <th className="py-3 px-4 text-left font-medium">Title</th>
                    <th className="py-3 px-4 text-left font-medium">Difficulty</th>
                    <th className="py-3 px-4 text-left font-medium">Tags</th>
                    <th className="py-3 px-4 text-left font-medium">Time/Memory</th>
                    <th className="py-3 px-4 text-left font-medium w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {problems.map((problem, ) => (
                    <tr 
                      key={problem._id} 
                      className="border-t border-gray-700 hover:bg-[#1a2540]"
                    >
                      <td className="py-3 px-4">
                        <div className="flex justify-center text-gray-500 cursor-move">
                          <FaGripVertical />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">{problem.title}</td>
                      <td className="py-3 px-4">
                        <span className={getDifficultyColor(problem.difficulty)}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags?.map((tag, i) => (
                            <span key={i} className="bg-[#0f172a] text-blue-400 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {problem.timeLimit}ms / {problem.memoryLimit}MB
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-400 hover:text-blue-300"
                            onClick={() => handleEditProblem(problem)}
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="text-red-400 hover:text-red-300"
                            onClick={() => handleDeleteProblem(problem._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default Page;