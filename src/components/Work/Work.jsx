import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ⚠️ CONFIGURATION: Replace with your usernames
const LEETCODE_USERNAME = "oSxvdj7DbT";
const GITHUB_USERNAME = "Chad-noob";  // Add your GitHub username here

// Manual fallback stats (update these manually if APIs fail)
const MANUAL_STATS = {
  easy: 25,      // Update with your actual stats
  medium: 15,    // Update with your actual stats
  hard: 3,       // Update with your actual stats
  total: 43      // Update with your actual stats
};

export default function Work() {
  const [leetcodeData, setLeetcodeData] = useState(null);
  const [githubData, setGithubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [githubLoading, setGithubLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch LeetCode stats
  useEffect(() => {
    const fetchLeetCodeStats = async () => {
      try {
        setLoading(true);
        console.log('Fetching LeetCode data for:', LEETCODE_USERNAME);
        
        let data = null;
        let calendarData = null;
        let lastError = null;
        
        // Try alfa-leetcode-api for stats
        try {
          console.log('Fetching from alfa-leetcode-api...');
          const [profileRes, calendarRes] = await Promise.all([
            fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USERNAME.trim()}`),
            fetch(`https://alfa-leetcode-api.onrender.com/${LEETCODE_USERNAME.trim()}/calendar`)
          ]);   
          
          if (profileRes.ok) {
            data = await profileRes.json();
            console.log('Profile data:', data);
          }
          
          if (calendarRes.ok) {
            calendarData = await calendarRes.json();
            console.log('Calendar data:', calendarData);
          }
        } catch (err) {
          console.log('alfa-leetcode-api failed:', err.message);
          lastError = err;
        }
        
        // If alfa API didn't work, try other APIs for basic stats
        if (!data) {
          const fallbackApis = [
            `https://leetcode-stats-api.herokuapp.com/${LEETCODE_USERNAME.trim()}`,
            `https://leetcode.com/${LEETCODE_USERNAME.trim()}`
          ];
          
          for (const apiUrl of fallbackApis) {
            try {
              console.log('Trying fallback API:', apiUrl);
              const response = await fetch(apiUrl);
              
              if (response.ok) {
                data = await response.json();
                console.log('Fallback API response:', data);
                
                if (data && (data.totalSolved || data.easySolved !== undefined)) {
                  break;
                }
              }
            } catch (err) {
              console.log('Fallback API failed:', apiUrl, err.message);
              lastError = err;
            }
          }
        }
        
        // Parse the data from whichever API worked
        if (data) {
          const easySolved = data.easySolved || data.submitStatsGlobal?.acSubmissionNum?.[1]?.count || 0;
          const mediumSolved = data.mediumSolved || data.submitStatsGlobal?.acSubmissionNum?.[2]?.count || 0;
          const hardSolved = data.hardSolved || data.submitStatsGlobal?.acSubmissionNum?.[3]?.count || 0;
          const totalSolved = data.totalSolved || data.submitStatsGlobal?.acSubmissionNum?.[0]?.count || (easySolved + mediumSolved + hardSolved);
          
          // Use calendar data if available, otherwise use empty calendar
          const submissionCalendar = calendarData?.submissionCalendar || 
                                    data.submissionCalendar || 
                                    (calendarData ? JSON.stringify(calendarData) : "{}");
          
          const transformedData = {
            username: LEETCODE_USERNAME,
            submitStats: {
              acSubmissionNum: [
                { difficulty: "Easy", count: easySolved },
                { difficulty: "Medium", count: mediumSolved },
                { difficulty: "Hard", count: hardSolved }
              ]
            },
            userCalendar: {
              totalActiveDays: calendarData?.totalActiveDays || data.totalActiveDays || totalSolved,
              streak: calendarData?.streak || data.streak || 0,
              submissionCalendar: submissionCalendar
            }
          };
          
          setLeetcodeData(transformedData);
          setError(null);
          console.log('LeetCode data loaded successfully');
        } else {
          throw lastError || new Error('All APIs failed');
        }
      } catch (err) {
        console.error("Error fetching LeetCode data:", err);
        setError(`Could not load LeetCode data. Failed to fetch`);
      } finally {
        setLoading(false);
      }
    };

    fetchLeetCodeStats();

    // Refresh data every 30 minutes (reduced to avoid rate limits)
    const interval = setInterval(fetchLeetCodeStats, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch GitHub stats
  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setGithubLoading(true);
        console.log('Fetching GitHub data for:', GITHUB_USERNAME);

        // Fetch user stats from GitHub API
        const userResponse = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        });
        
        if (!userResponse.ok) {
          console.log(`GitHub API returned status: ${userResponse.status}`);
          throw new Error(`GitHub API error: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log('GitHub user data:', userData);

        // Try to get contribution stats
        let contributionsData = { total: { lastYear: 0 } };
        
        try {
          const contribResponse = await fetch(
            `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
          );
          
          if (contribResponse.ok) {
            contributionsData = await contribResponse.json();
            console.log('GitHub contributions data:', contributionsData);
          }
        } catch (err) {
          console.log('Contributions API failed:', err.message);
          // Fallback: estimate from repo count
          contributionsData.total.lastYear = userData.public_repos * 5;
        }

        setGithubData({
          username: userData.login,
          name: userData.name,
          avatar: userData.avatar_url,
          bio: userData.bio,
          publicRepos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          contributions: contributionsData
        });

        console.log('GitHub data loaded successfully');
      } catch (err) {
        console.error("Error fetching GitHub data:", err);
        // Don't set to null, keep any existing data
        console.log('Will display contribution graph only');
      } finally {
        setGithubLoading(false);
      }
    };

    if (GITHUB_USERNAME !== "YOUR_GITHUB_USERNAME") {
      fetchGitHubStats();
      
      // Auto-refresh every 10 minutes
      const interval = setInterval(fetchGitHubStats, 10 * 60 * 1000);
      return () => clearInterval(interval);
    } else {
      setGithubLoading(false);
    }
  }, []);

  // Parse submission calendar data
  const getContributionData = () => {
    if (!leetcodeData?.userCalendar?.submissionCalendar) return [];
    
    const calendar = JSON.parse(leetcodeData.userCalendar.submissionCalendar);
    const contributions = [];
    const today = new Date();
    const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

    for (let date = new Date(yearAgo); date <= today; date.setDate(date.getDate() + 1)) {
      const timestamp = Math.floor(date.getTime() / 1000);
      const count = calendar[timestamp] || 0;
      contributions.push({
        date: new Date(date),
        count: count,
        level: count === 0 ? 0 : count < 5 ? 1 : count < 10 ? 2 : count < 15 ? 3 : 4
      });
    }

    return contributions;
  };

  const contributions = getContributionData();

  // Calculate total submissions from calendar
  const getTotalSubmissions = () => {
    if (!leetcodeData?.userCalendar?.submissionCalendar) return 0;
    
    try {
      const calendar = JSON.parse(leetcodeData.userCalendar.submissionCalendar);
      return Object.values(calendar).reduce((sum, count) => sum + (parseInt(count) || 0), 0);
    } catch (err) {
      return 0;
    }
  };

  const totalSubmissions = getTotalSubmissions();

  // Get stats
  const getStats = () => {
    if (!leetcodeData) return { easy: 0, medium: 0, hard: 0, total: 0 };
    
    const stats = leetcodeData.submitStats?.acSubmissionNum || [];
    const easy = stats.find(s => s.difficulty === "Easy")?.count || 0;
    const medium = stats.find(s => s.difficulty === "Medium")?.count || 0;
    const hard = stats.find(s => s.difficulty === "Hard")?.count || 0;
    
    return { easy, medium, hard, total: easy + medium + hard };
  };

  const stats = getStats();

  // Get color based on contribution level
  const getColor = (level) => {
    const colors = [
      '#1e1e1e', // No contributions
      '#0e4429', // Low
      '#006d32', // Medium-low
      '#26a641', // Medium-high
      '#39d353'  // High
    ];
    return colors[level];
  };

  // Group contributions by week
  const groupByWeeks = (contributions) => {
    const weeks = [];
    let currentWeek = [];
    
    contributions.forEach((day, index) => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const weeks = groupByWeeks(contributions);

  return (
    <section id="work" className="min-h-screen bg-[#0d0d0d] text-white py-20 px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-6xl md:text-8xl font-bold mb-16 text-center">
          Work & <span className="text-gray-500">Practice</span>
        </h2>

        {/* LeetCode Section */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
            <div className="flex-1">
              <h3 className="text-3xl font-bold">LeetCode Stats</h3>
              <p className="text-gray-400"></p>
            </div>
            {leetcodeData && (
              <a
                href={`https://leetcode.com/${LEETCODE_USERNAME.trim()}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                View Profile →
              </a>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              {MANUAL_STATS.total > 0 ? (
                <>
                  {/* Show stats cleanly without error box when manual stats exist */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                      <p className="text-4xl font-bold text-green-400">{MANUAL_STATS.total}</p>
                      <p className="text-gray-400 mt-2">Total Solved</p>
                    </div>
                    <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                      <p className="text-4xl font-bold text-green-500">{MANUAL_STATS.easy}</p>
                      <p className="text-gray-400 mt-2">Easy</p>
                    </div>
                    <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                      <p className="text-4xl font-bold text-yellow-500">{MANUAL_STATS.medium}</p>
                      <p className="text-gray-400 mt-2">Medium</p>
                    </div>
                    <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                      <p className="text-4xl font-bold text-red-500">{MANUAL_STATS.hard}</p>
                      <p className="text-gray-400 mt-2">Hard</p>
                    </div>
                  </div>

                  {/* Visual Progress Bars */}
                  <div className="bg-[#0d0d0d] rounded-xl p-6 mb-8">
                    <h4 className="text-xl font-semibold mb-4">Problem Difficulty Breakdown</h4>
                    <div className="space-y-4">
                      {/* Easy Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-green-500">Easy</span>
                          <span className="text-gray-400">{MANUAL_STATS.easy} / {MANUAL_STATS.total}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div 
                            className="bg-green-500 h-3 rounded-full transition-all"
                            style={{ width: `${(MANUAL_STATS.easy / MANUAL_STATS.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      {/* Medium Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-yellow-500">Medium</span>
                          <span className="text-gray-400">{MANUAL_STATS.medium} / {MANUAL_STATS.total}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div 
                            className="bg-yellow-500 h-3 rounded-full transition-all"
                            style={{ width: `${(MANUAL_STATS.medium / MANUAL_STATS.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      {/* Hard Progress */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-red-500">Hard</span>
                          <span className="text-gray-400">{MANUAL_STATS.hard} / {MANUAL_STATS.total}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                          <div 
                            className="bg-red-500 h-3 rounded-full transition-all"
                            style={{ width: `${(MANUAL_STATS.hard / MANUAL_STATS.total) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <a 
                    href={`https://leetcode.com/${LEETCODE_USERNAME.trim()}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    View My LeetCode Profile →
                  </a>
                </>
              ) : (
                <>
                  {/* Show error only if no manual stats */}
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded-xl p-6 mb-6">
                    <p className="text-yellow-400 mb-2 text-lg font-semibold">⚠️ API Temporarily Unavailable</p>
                    <p className="text-gray-400 text-sm mb-1">{error}</p>
                    <p className="text-gray-500 text-xs">The LeetCode API is rate limited. This is a temporary issue.</p>
                  </div>
                  <a 
                    href={`https://leetcode.com/${LEETCODE_USERNAME.trim()}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-8 py-3 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    View My LeetCode Profile →
                  </a>
                  <p className="text-gray-500 text-sm mt-4">Visit my profile to see live stats</p>
                </>
              )}
            </div>
          )}

          {!loading && !error && leetcodeData && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-green-400">{stats.total}</p>
                  <p className="text-gray-400 mt-2">Total Solved</p>
                </div>
                <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-green-500">{stats.easy}</p>
                  <p className="text-gray-400 mt-2">Easy</p>
                </div>
                <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-yellow-500">{stats.medium}</p>
                  <p className="text-gray-400 mt-2">Medium</p>
                </div>
                <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                  <p className="text-4xl font-bold text-red-500">{stats.hard}</p>
                  <p className="text-gray-400 mt-2">Hard</p>
                </div>
              </div>

              {/* Contribution Graph */}
              {contributions.length > 0 && (
                <div className="overflow-x-auto">
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Submission Activity</h4>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold text-white">{totalSubmissions}</span> submissions in the past one year • {' '}
                      {leetcodeData.userCalendar?.totalActiveDays || 0} active days • 
                      Current streak: {leetcodeData.userCalendar?.streak || 0} days
                    </p>
                  </div>
                  
                  <div className="inline-flex gap-1 p-4 bg-[#0d0d0d] rounded-xl">
                    {weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer"
                            style={{ backgroundColor: getColor(day.level) }}
                            title={`${day.date.toLocaleDateString()}: ${day.count} submissions`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map(level => (
                      <div
                        key={level}
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: getColor(level) }}
                      />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* GitHub Section */}
        {GITHUB_USERNAME !== "YOUR_GITHUB_USERNAME" && (
          <div className="bg-[#1a1a1a] rounded-2xl p-8 mb-12">
            <div className="flex items-center gap-4 mb-8">
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <div className="flex-1">
                <h3 className="text-3xl font-bold">GitHub Activity</h3>
                <p className="text-gray-400">Open source contributions & projects</p>
              </div>
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                View Profile →
              </a>
            </div>

            {githubLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}

            {!githubLoading && githubData && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-3 gap-4 mb-12">
                  <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-blue-400">{githubData.publicRepos}</p>
                    <p className="text-gray-400 mt-2">Public Repos</p>
                  </div>
                  <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-purple-400">{githubData.followers}</p>
                    <p className="text-gray-400 mt-2">Followers</p>
                  </div>
                  <div className="bg-[#0d0d0d] rounded-xl p-6 text-center">
                    <p className="text-4xl font-bold text-green-400">
                      {githubData.contributions?.total?.lastYear || 0}
                    </p>
                    <p className="text-gray-400 mt-2">Contributions</p>
                  </div>
                </div>

                {/* Contribution Graph - Always show image-based graph */}
                <div className="overflow-x-auto">
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Contribution Activity (Last Year)</h4>
                    <p className="text-sm text-gray-400">
                      {githubData.contributions?.total?.lastYear || 0} contributions in the last year
                    </p>
                  </div>
                  
                  {/* GitHub contribution graph - reliable image-based service */}
                  <div className="bg-[#0d0d0d] rounded-xl p-4">
                    <img 
                      src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
                      alt="GitHub Contribution Graph"
                      className="w-full"
                      style={{ filter: 'brightness(0.9)' }}
                    />
                  </div>

                  {/* Custom interactive grid - only if API data available */}
                  {githubData.contributions?.contributions && (
                    <div className="mt-6 p-4 bg-[#0d0d0d] rounded-xl">
                      <div className="flex flex-wrap gap-1">
                        {githubData.contributions.contributions.map((week, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-1">
                              {week.days?.map((day, dayIndex) => (
                              <div
                                key={dayIndex}
                                className="w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer"
                                style={{
                                  backgroundColor: 
                                    day.contributionCount === 0 ? '#1e1e1e' :
                                    day.contributionCount < 5 ? '#0e4429' :
                                    day.contributionCount < 10 ? '#006d32' :
                                    day.contributionCount < 15 ? '#26a641' :
                                    '#39d353'
                                }}
                                title={`${day.date}: ${day.contributionCount} contributions`}
                              />
                            ))}
                          </div>
                        ))}
                      </div>
                      
                      {/* Legend */}
                      <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                        <span>Less</span>
                        <div className="w-3 h-3 rounded-sm bg-[#1e1e1e]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#0e4429]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#006d32]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#26a641]"></div>
                        <div className="w-3 h-3 rounded-sm bg-[#39d353]"></div>
                        <span>More</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {!githubLoading && !githubData && (
              <>
                {/* Always show the contribution graph even if API fails */}
                <div className="overflow-x-auto">
                  <div className="mb-4">
                    <h4 className="text-xl font-semibold mb-2">Contribution Activity (Last Year)</h4>
                    <p className="text-sm text-gray-400">
                    
                    </p>
                  </div>
                  
                  {/* GitHub contribution graph - reliable image-based service */}
                  <div className="bg-[#0d0d0d] rounded-xl p-4 mb-6">
                    <img 
                      src={`https://ghchart.rshah.org/${GITHUB_USERNAME}`}
                      alt="GitHub Contribution Graph"
                      className="w-full"
                      style={{ filter: 'brightness(0.9)' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-center py-8 text-gray-400">
                      <p>Graph temporarily unavailable</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
