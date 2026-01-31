"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Clock, Code } from "lucide-react";
import Navbar from "@/components/common/Navbar";

interface Submission {
  problemId: {
    _id: string;
    title: string;
    difficulty?: string;
  } | string;
  score: number;
  submissionStatus: "correct" | "wrong" | "partially correct";
  submissionTime: string;
  problemTitle?: string;
}

interface ContestData {
  _id: string;
  title: string;
  description?: string;
}

const SubmissionsPage = () => {
  const params = useParams();
  const router = useRouter();
  const contestId = params?.contestId as string;
  const [loading, setLoading] = useState(true);
  const [contest, setContest] = useState<ContestData | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log('\ud83d\udd04 Fetching submissions for contest:', contestId);
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Fetch contest details
        const contestRes = await fetch(`/api/contest/getContestById/${contestId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const contestData = await contestRes.json();
        
        if (contestData.success) {
          setContest(contestData.data);
        }

        // Fetch user's submissions from the dedicated endpoint
        const submissionsRes = await fetch(`/api/contest/user-submissions/${contestId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const submissionsData = await submissionsRes.json();

        console.log('\ud83d\udce6 Submissions API response:', {
          success: submissionsData.success,
          count: submissionsData.data?.length,
          data: submissionsData.data
        });

        if (submissionsData.success && Array.isArray(submissionsData.data)) {
          const subs = submissionsData.data.map((sub: any) => ({
            problemId: sub.problemId,
            score: sub.score,
            submissionStatus: sub.status || 'wrong',
            submissionTime: sub.submittedAt,
            problemTitle: typeof sub.problemId === 'object' ? sub.problemId.title : undefined,
          }));
          console.log('\u2705 Formatted submissions:', subs.length, 'submissions');
          console.table(subs.map((s: any) => ({ title: s.problemTitle, status: s.submissionStatus, score: s.score })));
          setSubmissions(subs);
        } else {
          console.log('\u26a0\ufe0f No submissions found or error:', submissionsData.message);
        }
      } catch (err) {
        console.error("\u274c Error fetching submissions:", err);
      } finally {
        setLoading(false);
      }
    };

    if (contestId) fetchData();

    // Listen for new submissions
    const handleUpdate = () => {
      fetchData();
    };

    window.addEventListener('userDataUpdated', handleUpdate);
    return () => {
      window.removeEventListener('userDataUpdated', handleUpdate);
    };
  }, [contestId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "correct":
        return <CheckCircle className="text-green-500" size={20} />;
      case "wrong":
        return <XCircle className="text-red-500" size={20} />;
      case "partially correct":
        return <Clock className="text-yellow-500" size={20} />;
      default:
        return <Code className="text-gray-400" size={20} />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "correct":
        return "bg-green-900/30 text-green-500";
      case "wrong":
        return "bg-red-900/30 text-red-500";
      case "partially correct":
        return "bg-yellow-900/30 text-yellow-500";
      default:
        return "bg-gray-700/30 text-gray-400";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-[#0f172a] min-h-screen text-white">
        {/* Header */}
        <div className="border-b border-gray-700 bg-[#0f172a]">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center text-gray-300 text-sm">
              <Link href="/contests" className="hover:text-blue-400">
                All Contests
              </Link>
              <span className="mx-2">›</span>
              <Link href={`/contest/start-contest/${contestId}`} className="hover:text-blue-400">
                {contest?.title || "Contest"}
              </Link>
              <span className="mx-2">›</span>
              <span className="text-gray-400">Submissions</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="bg-[#121B38] border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-white">My Submissions</h1>
            <p className="text-gray-400 text-sm mt-1">
              Review all your submission attempts for this contest
            </p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {submissions.length === 0 ? (
            <div className="text-center py-12 bg-[#121B38] border border-gray-700 rounded-lg">
              <Code className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-400">No submissions yet</p>
              <Link
                href={`/contest/start-contest/${contestId}`}
                className="mt-4 inline-block text-blue-400 hover:text-blue-300"
              >
                Start solving problems →
              </Link>
            </div>
          ) : (
            <div className="bg-[#121B38] border border-gray-700 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-[#121B38] text-gray-300 border-b border-gray-700">
                  <tr>
                    <th className="py-4 px-4 text-left font-medium w-1/3">Problem</th>
                    <th className="py-4 px-4 text-left font-medium w-1/6">Status</th>
                    <th className="py-4 px-4 text-left font-medium w-1/6">Score</th>
                    <th className="py-4 px-4 text-left font-medium w-1/6">Submitted At</th>
                    <th className="py-4 px-4 text-right font-medium w-1/6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission, index) => {
                    const problemId = typeof submission.problemId === 'object' 
                      ? submission.problemId._id 
                      : submission.problemId;
                    const problemTitle = typeof submission.problemId === 'object'
                      ? submission.problemId.title
                      : submission.problemTitle || "Problem";

                    return (
                      <tr
                        key={index}
                        className="border-t border-gray-700 hover:bg-[#1a2540]"
                      >
                        <td className="py-4 px-4 font-medium text-white">
                          {problemTitle}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(submission.submissionStatus)}
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(
                                submission.submissionStatus
                              )}`}
                            >
                              {submission.submissionStatus
                                .split(" ")
                                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                .join(" ")}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {submission.score} points
                        </td>
                        <td className="py-4 px-4 text-gray-400">
                          {new Date(submission.submissionTime).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() =>
                              router.push(`/contest/editor/${contestId}/${problemId}`)
                            }
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded font-medium transition-colors"
                          >
                            View Problem
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SubmissionsPage;
