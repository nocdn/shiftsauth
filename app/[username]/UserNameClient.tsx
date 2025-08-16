"use client"
import { useEffect, useMemo, useState, type CSSProperties } from "react"
import { MoveRight, X } from "lucide-react"
import Spinner from "@/components/Spinner"
import { AnimatePresence, motion } from "motion/react"

export default function UserNameClient({ username }: { username: string }) {
  const [allShifts, setAllShifts] = useState<any[]>([])
  const [shifts, setShifts] = useState<any[]>([])
  const [thisWeekShifts, setThisWeekShifts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [extraDataForShift, setExtraDataForShift] = useState<any>(null)

  function localWeekCommencingToDisplay() {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const daysUntilMonday = (dayOfWeek + 6) % 7
    const monday = new Date(today)
    monday.setDate(today.getDate() - daysUntilMonday)
    return monday.toISOString().split("T")[0]
  }

  useEffect(() => {
    const fetchShifts = async () => {
      const response = await fetch("/api/shifts")
      const data = await response.json()
      console.log(data)
      setAllShifts(data.data)
      // filter out shifts data and save it to shifts where the username parameter matches the person_name
      const filteredShifts = data.data.filter(
        (shift: any) =>
          shift.person_name.toLowerCase() === username.toLowerCase(),
      )
      console.log(filteredShifts)
      setShifts(filteredShifts)

      // get the week commencing of this week
      const thisWeekCommencing = localWeekCommencingToDisplay()
      console.log("this week commencing", thisWeekCommencing)
      const filteredThisWeekShifts = filteredShifts.filter((shift: any) =>
        shift.week_commencing.includes(thisWeekCommencing),
      )
      console.log("filtered this week shifts", filteredThisWeekShifts)
      // flatten and parse each shift entry; backend returns `shifts` as JSON strings
      const parsedWeekShifts = filteredThisWeekShifts.flatMap((person: any) =>
        (person.shifts || []).map((s: any) =>
          typeof s === "string" ? JSON.parse(s) : s,
        ),
      )
      console.log("this week parsed shifts", parsedWeekShifts)
      setThisWeekShifts(parsedWeekShifts)
      setIsLoading(false)
    }
    fetchShifts()
  }, [])

  const daysOfTheWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]

  function formatTime(isoString: string) {
    const date = new Date(isoString)
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  const shiftsByDay = useMemo(() => {
    const grouped: Record<number, { start: string; end: string }[]> = {}
    for (const shift of thisWeekShifts) {
      const startDate = new Date(shift.start)
      const jsDay = startDate.getDay() // 0=Sun..6=Sat
      const mondayFirstIndex = (jsDay + 6) % 7 // 0=Mon..6=Sun
      if (!grouped[mondayFirstIndex]) grouped[mondayFirstIndex] = []
      grouped[mondayFirstIndex].push(shift)
    }
    // sort within each day by start time
    Object.values(grouped).forEach((arr) =>
      arr.sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      ),
    )
    return grouped
  }, [thisWeekShifts])

  const emptyCellStripes: CSSProperties = {
    backgroundImage: `
      linear-gradient(to right, white 0%, rgba(255,255,255,0.85) 4%, transparent 20%, transparent 80%, rgba(255,255,255,0.85) 96%, white 100%),
      linear-gradient(to bottom, white 0%, rgba(255,255,255,0.85) 5%, transparent 10%, transparent 90%, rgba(255,255,255,0.85) 95%, white 100%),
      repeating-linear-gradient(135deg, rgba(59,130,246,0.05) 0px, rgba(59,130,246,0.05) 10px, transparent 10px, transparent 20px)
    `,
    backgroundBlendMode: "normal",
  }

  return (
    <div className="flex flex-col gap-1.5 p-8 font-sf-pro-rounded">
      <h1 className="text-2xl font-medium flex items-center justify-between">
        Hello {username.charAt(0).toUpperCase() + username.slice(1)},
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.25 } }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <Spinner className="opacity-50 mt-1" size={0.85} />
            </motion.div>
          )}
        </AnimatePresence>
      </h1>
      <h2 className="text-[15px] font-medium text-gray-600 font-jetbrains-mono">
        [SHIFTS THIS WEEK]
      </h2>
      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden ml-[1px] divide-y divide-gray-200 mt-5">
        {daysOfTheWeek.map((dayLabel, index) => {
          const dayShifts = shiftsByDay[index] || []
          const hasShifts = dayShifts.length > 0
          return (
            <div
              key={dayLabel}
              className="flex"
              onClick={() => {
                const thisWeekCommencing = localWeekCommencingToDisplay()
                const othersForWeek = (allShifts || []).filter(
                  (row: any) =>
                    typeof row.week_commencing === "string" &&
                    row.week_commencing.includes(thisWeekCommencing) &&
                    row.person_name?.toLowerCase() !== username.toLowerCase(),
                )
                const othersWorking = othersForWeek
                  .map((person: any) => {
                    const parsed = (person.shifts || []).map((s: any) =>
                      typeof s === "string" ? JSON.parse(s) : s,
                    ) as { start: string; end: string }[]
                    const todays = parsed.filter((s) => {
                      const jsDay = new Date(s.start).getDay()
                      const mondayFirstIndex = (jsDay + 6) % 7
                      return mondayFirstIndex === index
                    })
                    return todays.length > 0
                      ? { person: person.person_name, shifts: todays }
                      : null
                  })
                  .filter(Boolean)
                  .map((entry: any) => ({
                    person: entry.person,
                    shifts: entry.shifts.map((s: any) => ({
                      start: formatTime(s.start),
                      end: formatTime(s.end),
                    })),
                  }))
                console.log(`Others working on ${dayLabel}:`, othersWorking)
                setExtraDataForShift(othersWorking)
              }}
            >
              <div className="w-24 shrink-0 bg-gray-50/70 px-4 py-3 text-[12.5px] tracking-[0.14em] text-gray-700 font-jetbrains-mono grid place-items-center">
                {dayLabel}
              </div>
              <div
                className={
                  "flex-1 px-2 py-2 min-h-12 grid items-center content-center gap-2 " +
                  (hasShifts ? "bg-white" : "bg-white")
                }
                style={hasShifts ? undefined : emptyCellStripes}
              >
                {hasShifts && (
                  <div className="flex flex-wrap items-center gap-2">
                    {dayShifts.map((shift, i) => (
                      <div
                        key={`${shift.start}-${i}`}
                        className="inline-flex items-center justify-around gap-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-900 px-2.5 py-1.5 font-jetbrains-mono text-[13px] w-full"
                      >
                        <span>{formatTime(shift.start)}</span>
                        <MoveRight size={14} className="text-blue-700/80" />
                        <span>{formatTime(shift.end)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <AnimatePresence>
        {extraDataForShift && (
          <motion.div
            initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              filter: "blur(3px)",
              y: 5,
            }}
            className="text-sm text-gray-500 mt-7"
          >
            <h2 className="text-[15px] font-medium text-gray-600 font-jetbrains-mono mb-3 flex items-center justify-between">
              [PEOPLE ALSO WORKING]
              <div
                className="w-6 h-6 bg-gray-100 text-[#949595] rounded-full flex items-center justify-center"
                onClick={() => {
                  setExtraDataForShift(null)
                }}
              >
                <X strokeWidth={2.75} size={16} />
              </div>
            </h2>
            <div className="mt-2 space-y-2">
              {Array.isArray(extraDataForShift) &&
              extraDataForShift.length > 0 ? (
                extraDataForShift.map((entry: any) => (
                  <div
                    key={entry.person}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50/60 px-3 py-2"
                  >
                    <div className="text-gray-800 font-medium font-geist">
                      {entry.person}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {entry.shifts.map((s: any, i: number) => (
                        <div
                          key={`${entry.person}-${i}`}
                          className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-0.5 text-[12px] font-jetbrains-mono text-gray-700"
                        >
                          <span>{s.start}</span>
                          <MoveRight size={12} className="text-gray-400" />
                          <span>{s.end}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[13px] text-gray-500 mt-1">
                  Click a day above to see who else is working.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
