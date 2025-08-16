"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast" // Import useToast
import { ToastAction } from "@/components/ui/toast" // Import ToastAction
import {
  Mail,
  Calendar,
  Search,
  Download,
  MoreHorizontal,
  AlertTriangle,
  Eye,
  Award,
  Shuffle,
  FileText,
  RefreshCw,
} from "lucide-react"

import EmailManagement from "./components/email-mangement"

// Committee and Country Configuration
const COMMITTEES = {
  UNGA: {
    name: "United Nations General Assembly",
    capacity: 100, // Updated capacity
    countries: [
      "United States",
      "China",
      "Russia",
      "United Kingdom",
      "France",
      "Germany",
      "Japan",
      "India",
      "Brazil",
      "Canada",
      "Australia",
      "South Korea",
      "Italy",
      "Spain",
      "Netherlands",
      "Sweden",
      "Norway",
      "Denmark",
      "Finland",
      "Belgium",
      "Switzerland",
      "Austria",
      "Poland",
      "Czech Republic",
      "Hungary",
      "Greece",
      "Portugal",
      "Ireland",
      "New Zealand",
      "Singapore",
      "Malaysia",
      "Thailand",
      "Indonesia",
      "Philippines",
      "Vietnam",
      "South Africa",
      "Nigeria",
      "Egypt",
      "Morocco",
      "Kenya",
      "Argentina",
      "Chile",
      "Mexico",
      "Colombia",
      "Peru",
      "Venezuela",
      "Turkey",
      "Israel",
      "Saudi Arabia",
      "UAE",
    ],
  },
  AIPPM: {
    name: "All India Political Parties Meet",
    capacity: 100, // Updated capacity
    countries: [
      "Bharatiya Janata Party",
      "Indian National Congress",
      "Aam Aadmi Party",
      "Communist Party of India (Marxist)",
      "All India Trinamool Congress",
      "Dravida Munnetra Kazhagam",
      "Shiv Sena",
      "Nationalist Congress Party",
      "Janata Dal (United)",
      "Rashtriya Janata Dal",
      "Samajwadi Party",
      "Bahujan Samaj Party",
      "Telugu Desam Party",
      "YSR Congress Party",
      "Biju Janata Dal",
      "Communist Party of India",
      "Indian Union Muslim League",
      "Shiromani Akali Dal",
      "Janata Dal (Secular)",
      "Revolutionary Socialist Party",
      "Forward Bloc",
      "Maharashtrawadi Gomantak Party",
      "Mizo National Front",
      "National People's Party",
      "Zoram People's Movement",
      "Sikkim Krantikari Morcha",
      "Asom Gana Parishad",
      "Bodoland People's Front",
      "Hill State People's Democratic Party",
      "United Democratic Party",
    ],
  },
  IP: {
    name: "International Press",
    capacity: 100, // Updated capacity
    countries: [
      "BBC (UK)",
      "CNN (USA)",
      "Al Jazeera (Qatar)",
      "Reuters (UK)",
      "Associated Press (USA)",
      "France 24 (France)",
      "Deutsche Welle (Germany)",
      "RT (Russia)",
      "CGTN (China)",
      "NHK (Japan)",
      "Times of India (India)",
      "The Guardian (UK)",
      "New York Times (USA)",
      "Le Monde (France)",
      "Der Spiegel (Germany)",
      "Pravda (Russia)",
      "People's Daily (China)",
      "Asahi Shimbun (Japan)",
      "Hindustan Times (India)",
      "The Economic Times (India)",
    ],
  },
  UNCSW: {
    name: "UN Commission on the Status of Women",
    capacity: 100, // Updated capacity
    countries: [
      "Sweden",
      "Norway",
      "Denmark",
      "Finland",
      "Iceland",
      "Canada",
      "New Zealand",
      "Australia",
      "Netherlands",
      "Germany",
      "France",
      "United Kingdom",
      "Switzerland",
      "Austria",
      "Belgium",
      "Ireland",
      "Luxembourg",
      "Portugal",
      "Spain",
      "Italy",
      "Japan",
      "South Korea",
      "Singapore",
      "Costa Rica",
      "Uruguay",
      "Chile",
      "Argentina",
      "Brazil",
      "South Africa",
      "Botswana",
      "Rwanda",
      "Ghana",
      "Kenya",
      "Tunisia",
      "Jordan",
    ],
  },
  UNDP: {
    name: "United Nations Development Programme",
    capacity: 100, // Updated capacity
    countries: [
      "Norway",
      "Switzerland",
      "Australia",
      "Ireland",
      "Germany",
      "Iceland",
      "Hong Kong",
      "Sweden",
      "Singapore",
      "Netherlands",
      "Denmark",
      "Canada",
      "United States",
      "United Kingdom",
      "Finland",
      "New Zealand",
      "Belgium",
      "Liechtenstein",
      "Japan",
      "Austria",
      "Luxembourg",
      "Israel",
      "South Korea",
      "France",
      "Slovenia",
      "Spain",
      "Czech Republic",
      "Italy",
      "Estonia",
      "Andorra",
      "Cyprus",
      "Malta",
      "Poland",
      "Lithuania",
      "Saudi Arabia",
      "Portugal",
      "UAE",
      "Slovakia",
      "Brunei",
      "Qatar",
    ],
  },
  UNEP: {
    name: "United Nations Environment Programme",
    capacity: 100, // Updated capacity
    countries: [
      "Costa Rica",
      "Switzerland",
      "France",
      "Denmark",
      "Malta",
      "Sweden",
      "United Kingdom",
      "Luxembourg",
      "Austria",
      "Ireland",
      "Finland",
      "Italy",
      "Germany",
      "New Zealand",
      "Belgium",
      "Spain",
      "Portugal",
      "Slovenia",
      "Greece",
      "Cyprus",
      "Estonia",
      "Czech Republic",
      "Lithuania",
      "Latvia",
      "Slovakia",
      "Hungary",
      "Poland",
      "Croatia",
      "Bulgaria",
      "Romania",
      "Chile",
      "Uruguay",
      "Argentina",
      "Brazil",
      "Colombia",
      "Ecuador",
      "Peru",
      "Panama",
      "Mexico",
      "Barbados",
      "Jamaica",
      "Trinidad and Tobago",
      "Bahamas",
      "Seychelles",
      "Mauritius",
    ],
  },
}

const AdminPanel = () => {
  const [registrations, setRegistrations] = useState([])
  const [allocations, setAllocations] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all") // Now includes "Accommodation"
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedRows, setSelectedRows] = useState(new Set()) // Not used in current UI, but kept
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false) // Not used in current UI, but kept
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [activeTab, setActiveTab] = useState("registrations")
  const [selectedCommittee, setSelectedCommittee] = useState("UNGA") // Not used in current UI, but kept
  const [allocationMode, setAllocationMode] = useState("auto") // Default to auto
  const [prioritySetting, setPrioritySetting] = useState("preference") // Default to preference based

  const { toast } = useToast() // Initialize toast

  const fetchRegistrations = useCallback(() => {
    axios
      .get("https://mun-panel-backend.onrender.com/api/registrations")
      .then((res) => {
        const sortedData = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        setRegistrations(sortedData)
        // Re-evaluate allocations based on new data if needed, or keep existing
        // For simplicity, we'll keep existing allocations unless explicitly cleared/re-run auto-allocate
      })
      .catch((err) => console.error("Error fetching registrations:", err))
  }, [])

  useEffect(() => {
    fetchRegistrations()
  }, [fetchRegistrations])

  // Helper to find committee ID from a preference string (e.g., "UNGA" or "United Nations General Assembly (UNGA)")
  const getCommitteeIdFromPreference = useCallback((preferenceString) => {
    if (!preferenceString) return null
    const normalizedPref = preferenceString.toLowerCase().trim()
    for (const id in COMMITTEES) {
      const committee = COMMITTEES[id]
      const committeeNameLower = committee.name.toLowerCase().trim()
      const committeeIdLower = id.toLowerCase().trim() // Use the key as the ID/abbreviation

      // Check if the preference string includes either the full committee name or its ID/abbreviation
      if (normalizedPref.includes(committeeNameLower) || normalizedPref.includes(committeeIdLower)) {
        return id
      }
    }
    return null
  }, [])

  // Allocation Logic
  const allocationAnalysis = useMemo(() => {
    const analysis = {}
    Object.keys(COMMITTEES).forEach((committeeId) => {
      const committee = COMMITTEES[committeeId]
      const allocated = Object.values(allocations).filter((a) => a.committee === committeeId)
      const waitlist = [] // This waitlist is not dynamically populated here, but in auto-allocation

      // Use the robust getCommitteeIdFromPreference for accurate interested counts
      const interested = registrations
        .filter((r) => {
          const pref1Id = getCommitteeIdFromPreference(r.committeePreference1)
          const pref2Id = getCommitteeIdFromPreference(r.committeePreference2)
          return pref1Id === committeeId || pref2Id === committeeId
        })
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

      const firstChoice = interested.filter((r) => getCommitteeIdFromPreference(r.committeePreference1) === committeeId)
      const secondChoice = interested.filter(
        (r) =>
          getCommitteeIdFromPreference(r.committeePreference2) === committeeId &&
          getCommitteeIdFromPreference(r.committeePreference1) !== committeeId,
      ) // Ensure no double counting if also 1st choice

      const available = committee.capacity - allocated.length

      analysis[committeeId] = {
        ...committee,
        allocated: allocated.length,
        available,
        interested: interested.length,
        firstChoice: firstChoice.length,
        secondChoice: secondChoice.length,
        waitlist: waitlist.length, // This will be 0 unless waitlist logic is added here
        fillPercentage: (allocated.length / committee.capacity) * 100,
        registrations: interested,
        allocatedCountries: allocated.map((a) => a.country),
        availableCountries: committee.countries.filter((c) => !allocated.map((a) => a.country).includes(c)),
      }
    })
    return analysis
  }, [registrations, allocations, getCommitteeIdFromPreference])

  // Auto-allocation function - NOW USES prioritySetting
  const performAutoAllocation = () => {
    const newAllocations = {} // Start with a fresh allocation object for a full re-run

    // Initialize committee status for a fresh allocation run
    const currentCommitteeStatus = Object.fromEntries(
      Object.entries(COMMITTEES).map(([id, committee]) => [
        id,
        {
          ...committee,
          allocatedCount: 0, // Start with 0 allocated for a fresh run
          availableCountries: [...committee.countries], // All countries available initially
        },
      ]),
    )

    const sortedRegistrations = [...registrations].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    // Apply random sorting if priority is "random"
    if (prioritySetting === "random") {
      for (let i = sortedRegistrations.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[sortedRegistrations[i], sortedRegistrations[j]] = [sortedRegistrations[j], sortedRegistrations[i]]
      }
    }

    let allocatedCount = 0
    let waitlistedCount = 0

    sortedRegistrations.forEach((registration) => {
      let allocated = false

      if (prioritySetting === "fcfs") {
        // FCFS: Allocate to first available committee, ignoring preferences
        for (const committeeId in currentCommitteeStatus) {
          const committeeData = currentCommitteeStatus[committeeId]
          if (committeeData.allocatedCount < committeeData.capacity && committeeData.availableCountries.length > 0) {
            const countryToAllocate = committeeData.availableCountries.shift()
            newAllocations[registration._id] = {
              committee: committeeId,
              country: countryToAllocate,
              preference: 0, // 0 indicates allocated without preference consideration
              allocatedAt: new Date().toISOString(),
              status: "allocated",
            }
            committeeData.allocatedCount++
            allocated = true
            allocatedCount++
            break // Stop after finding the first available spot
          }
        }
      } else {
        // Preference Based (default) or Random (after initial shuffle)
        // 1. Try first preference
        const firstPrefId = getCommitteeIdFromPreference(registration.committeePreference1)
        if (firstPrefId && currentCommitteeStatus[firstPrefId]?.allocatedCount < COMMITTEES[firstPrefId].capacity) {
          const availableCountries = currentCommitteeStatus[firstPrefId].availableCountries
          if (availableCountries.length > 0) {
            const countryToAllocate = availableCountries.shift() // Take the first available country
            newAllocations[registration._id] = {
              committee: firstPrefId,
              country: countryToAllocate,
              preference: 1, // Set preference to 1
              allocatedAt: new Date().toISOString(),
              status: "allocated",
            }
            currentCommitteeStatus[firstPrefId].allocatedCount++
            allocated = true
            allocatedCount++
          }
        }

        // 2. If not allocated yet, try second preference
        if (!allocated) {
          const secondPrefId = getCommitteeIdFromPreference(registration.committeePreference2)
          if (
            secondPrefId &&
            currentCommitteeStatus[secondPrefId]?.allocatedCount < COMMITTEES[secondPrefId].capacity
          ) {
            const availableCountries = currentCommitteeStatus[secondPrefId].availableCountries
            if (availableCountries.length > 0) {
              const countryToAllocate = availableCountries.shift() // Take the first available country
              newAllocations[registration._id] = {
                committee: secondPrefId,
                country: countryToAllocate,
                preference: 2, // Set preference to 2
                allocatedAt: new Date().toISOString(),
                status: "allocated",
              }
              currentCommitteeStatus[secondPrefId].allocatedCount++
              allocated = true
              allocatedCount++
            }
          }
        }

        // 3. If still not allocated, try any available committee (non-preferred) in defined order
        if (!allocated) {
          for (const committeeId in currentCommitteeStatus) {
            const committeeData = currentCommitteeStatus[committeeId]
            if (committeeData.allocatedCount < committeeData.capacity && committeeData.availableCountries.length > 0) {
              const countryToAllocate = committeeData.availableCountries.shift()
              newAllocations[registration._id] = {
                committee: committeeId,
                country: countryToAllocate,
                preference: 0, // 0 indicates allocated to a non-preferred committee
                allocatedAt: new Date().toISOString(),
                status: "allocated",
              }
              committeeData.allocatedCount++
              allocated = true
              allocatedCount++
              break // Stop after finding the first available spot
            }
          }
        }
      }

      // 4. If still not allocated (meaning ALL committees are full), then waitlist
      if (!allocated) {
        newAllocations[registration._id] = {
          committee: null,
          country: null,
          preference: null,
          allocatedAt: new Date().toISOString(),
          status: "waitlist", // Only waitlist if no spots are available anywhere
        }
        waitlistedCount++
      }
    })
    setAllocations(newAllocations)

    // Show toast notification
    toast({
      title: "Auto-Allocation Complete!",
      description: `Processed ${registrations.length} registrations. ${allocatedCount} allocated, ${waitlistedCount} waitlisted.`,
      action: (
        <ToastAction altText="View Allocations" onClick={() => setActiveTab("allocations")}>
          View
        </ToastAction>
      ),
    })
  }

  // Manual allocation function
  const allocateManually = (registrationId, committee, country) => {
    setAllocations((prev) => ({
      ...prev,
      [registrationId]: {
        committee,
        country,
        preference:
          registrations.find((r) => r._id === registrationId)?.committeePreference1 === COMMITTEES[committee]?.name
            ? 1
            : 2,
        allocatedAt: new Date().toISOString(),
        status: "allocated",
      },
    }))
  }

  // Export allocation results
  const exportAllocations = () => {
    const data = registrations.map((r) => {
      const allocation = allocations[r._id]
      return {
        Name: r.fullName,
        Email: r.email,
        University: r.university,
        "Delegate Type": r.delegateType,
        "First Preference": r.committeePreference1,
        "Second Preference": r.committeePreference2,
        "Allocated Committee": allocation?.committee ? COMMITTEES[allocation.committee]?.name : "Not Allocated",
        "Allocated Country": allocation?.country || "Not Allocated",
        "Preference Met": allocation?.preference || "N/A",
        Status: allocation?.status || "Pending",
        "Registration Date": new Date(r.createdAt).toLocaleDateString(),
        "Allocation Date": allocation?.allocatedAt ? new Date(allocation.allocatedAt).toLocaleDateString() : "N/A",
      }
    })
    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(","),
      ...data.map((row) => headers.map((header) => `"${row[header]}"`).join(",")),
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cumun-allocations-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  // Duplicate detection (keeping existing logic)
  const duplicateAnalysis = useMemo(() => {
    const emailMap = new Map()
    const phoneMap = new Map()
    const nameMap = new Map()
    const duplicates = new Set()
    registrations.forEach((reg) => {
      if (emailMap.has(reg.email)) {
        duplicates.add(reg._id)
        duplicates.add(emailMap.get(reg.email))
      } else {
        emailMap.set(reg.email, reg._id)
      }
      if (phoneMap.has(reg.phoneNumber)) {
        duplicates.add(reg._id)
        duplicates.add(phoneMap.get(reg.phoneNumber))
      } else {
        phoneMap.set(reg.phoneNumber, reg._id)
      }
      const normalizedName = reg.fullName?.toLowerCase().replace(/\s+/g, " ").trim()
      if (nameMap.has(normalizedName)) {
        duplicates.add(reg._id)
        duplicates.add(nameMap.get(normalizedName))
      } else {
        nameMap.set(normalizedName, reg._id)
      }
    })
    return {
      duplicateIds: duplicates,
      totalDuplicates: duplicates.size,
    }
  }, [registrations])

  // Enhanced filtering and sorting - FIXED FILTER LOGIC
  const processedRegistrations = useMemo(() => {
    const filtered = registrations.filter((registration) => {
      // Search term logic
      const matchesSearch =
        searchTerm === "" || // If search term is empty, always match
        registration.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.phoneNumber?.includes(searchTerm)

      // Filter by delegate type, including the new "Accommodation" option
      let matchesFilter = true // Default to true if filterType is 'all'
      if (filterType !== "all") {
        const selectedFilterType = filterType.toLowerCase().trim()

        if (selectedFilterType === "accommodation") {
          matchesFilter = registration.accommodationRequired === true
        } else if (selectedFilterType === "delegation") {
          const regDelegateType = registration.delegateType?.toLowerCase().trim() || ""
          matchesFilter = regDelegateType.includes("delegation")
        } else {
          const regDelegateType = registration.delegateType?.toLowerCase().trim() || ""
          matchesFilter = regDelegateType.includes(selectedFilterType)
        }
      }

      const matchesDuplicateFilter = !showDuplicatesOnly || duplicateAnalysis.duplicateIds.has(registration._id)
      return matchesSearch && matchesFilter && matchesDuplicateFilter
    })

    filtered.sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]

      if (sortField === "createdAt") {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      }

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })
    return filtered
  }, [registrations, searchTerm, filterType, sortField, sortDirection, showDuplicatesOnly, duplicateAnalysis])

  // Stats calculations
  const stats = useMemo(() => {
    const total = registrations.length
    const allocated = Object.values(allocations).filter((a) => a.status === "allocated").length
    const waitlisted = Object.values(allocations).filter((a) => a.status === "waitlist").length
    const pending = total - allocated - waitlisted

    // Calculate first and second choice satisfaction based on *allocated* delegates
    const allocatedDelegates = Object.values(allocations).filter((a) => a.status === "allocated")
    const firstChoiceSatisfied = allocatedDelegates.filter((a) => a.preference === 1).length
    const secondChoiceSatisfied = allocatedDelegates.filter((a) => a.preference === 2).length

    return {
      total,
      allocated,
      waitlisted,
      pending,
      allocationRate: total > 0 ? (allocated / total) * 100 : 0,
      duplicates: duplicateAnalysis.totalDuplicates,
      firstChoiceSatisfied,
      secondChoiceSatisfied,
    }
  }, [registrations, allocations, duplicateAnalysis])

  const getDelegateTypeBadge = (type) => {
    const colors = {
      Delegate: "bg-blue-100 text-blue-800",
      Chair: "bg-red-100 text-red-800",
      Observer: "bg-gray-100 text-gray-800",
      Press: "bg-green-100 text-green-800",
      Accommodation: "bg-purple-100 text-purple-800",
      Delegation: "bg-indigo-100 text-indigo-800", // New badge color for Delegation
      "Individual Delegate": "bg-blue-100 text-blue-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getAllocationStatus = (registrationId) => {
    const allocation = allocations[registrationId]
    if (!allocation) return { status: "pending", color: "bg-gray-100 text-gray-800" }
    switch (allocation.status) {
      case "allocated":
        return { status: "allocated", color: "bg-green-100 text-green-800" }
      case "waitlist":
        return { status: "waitlisted", color: "bg-yellow-100 text-yellow-800" }
      default:
        return { status: "pending", color: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-red-600">CUMUN-ISTE Admin Panel</h1>
              <p className="text-gray-600 mt-2">Advanced registration management with committee allocation system</p>
              <div className="h-1 w-24 bg-yellow-600 mt-3 rounded"></div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchRegistrations}
                className="text-gray-700 hover:text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button
                variant="outline"
                onClick={exportAllocations}
                className="text-gray-700 hover:text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="allocations">Allocations</TabsTrigger>
            <TabsTrigger value="emails">Email Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="emails" className="space-y-6">
            <EmailManagement registrations={registrations} allocations={allocations} />
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-6">
            {/* Duplicate Alert */}
            {stats.duplicates > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>{stats.duplicates} potential duplicate registrations</strong> detected. Review entries with
                  similar emails, phone numbers, or names.
                </AlertDescription>
              </Alert>
            )}
            {/* Enhanced Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-700">Registration Management</CardTitle>
                    <CardDescription className="text-gray-600">
                      {processedRegistrations.length} of {registrations.length} registrations
                    </CardDescription>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                      <Input
                        placeholder="Search registrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="all">All Types</option>
                      <option value="Delegate">Delegate</option>
                      <option value="Chair">Chair</option>
                      <option value="Observer">Observer</option>
                      <option value="Press">Press</option>
                      <option value="Accommodation">Accommodation</option>
                      <option value="Delegation">Delegation</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Delegate Info</TableHead>
                        <TableHead className="font-semibold text-gray-700">Preferences</TableHead>
                        <TableHead className="font-semibold text-gray-700">Allocation Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Registration Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedRegistrations.map((r) => {
                        const allocationStatus = getAllocationStatus(r._id)
                        const allocation = allocations[r._id]
                        const isDuplicate = duplicateAnalysis.duplicateIds.has(r._id)
                        return (
                          <TableRow
                            key={r._id}
                            className={`hover:bg-gray-50 ${isDuplicate ? "bg-yellow-50 border-l-4 border-l-yellow-400" : ""}`}
                          >
                            <TableCell>
                              <div className="space-y-1">
                                <div className="font-medium text-gray-700 flex items-center gap-2">
                                  {r.fullName}
                                  {isDuplicate && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300"
                                    >
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Duplicate
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">{r.email}</div>
                                <div className="text-sm text-gray-600">{r.university}</div>
                                <Badge className={getDelegateTypeBadge(r.delegateType)}>{r.delegateType}</Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="text-sm">
                                  <span className="font-medium text-gray-700">1st:</span> {r.committeePreference1}
                                </div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-700">2nd:</span> {r.committeePreference2}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-2">
                                <Badge className={allocationStatus.color}>
                                  {allocationStatus.status.toUpperCase()}
                                </Badge>
                                {allocation && allocation.status === "allocated" && (
                                  <div className="text-xs text-gray-600">
                                    <div>
                                      <strong>Committee:</strong> {COMMITTEES[allocation.committee]?.name}
                                    </div>
                                    <div>
                                      <strong>Country:</strong> {allocation.country}
                                    </div>
                                    <div>
                                      <strong>Preference:</strong>{" "}
                                      {allocation.preference === 1
                                        ? "1st Choice"
                                        : allocation.preference === 2
                                          ? "2nd Choice"
                                          : "Any Available"}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                                {new Date(r.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => setSelectedRegistration(r)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Award className="mr-2 h-4 w-4" />
                                    Manual Allocate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Send Email
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Committee Allocation Tab */}
          <TabsContent value="allocations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Committee Overview */}
              <div className="lg:col-span-2 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-700">Committee Allocation Overview</CardTitle>
                    <CardDescription>First-come-first-served allocation status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(allocationAnalysis).map(([committeeId, data]) => (
                      <div key={committeeId} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-700">{data.name}</h3>
                            <p className="text-sm text-gray-600">
                              {data.allocated}/{data.capacity} allocated • {data.interested} interested
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-red-600">{data.fillPercentage.toFixed(0)}%</div>
                            <div className="text-xs text-gray-600">filled</div>
                          </div>
                        </div>
                        <Progress value={data.fillPercentage} className="mb-2" />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>1st Choice: {data.firstChoice}</span>
                          <span>2nd Choice: {data.secondChoice}</span>
                          <span>Available: {data.available}</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
              {/* Quick Actions */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-700">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={performAutoAllocation} className="w-full bg-red-600 hover:bg-red-500 text-white">
                      <Shuffle className="w-4 h-4 mr-2" />
                      Auto Allocate All
                    </Button>
                    <Button variant="outline" onClick={exportAllocations} className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Export Results
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Reports
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-gray-700">Allocation Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Mode</label>
                      <Select value={allocationMode} onValueChange={setAllocationMode}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual</SelectItem>
                          <SelectItem value="auto">Automatic</SelectItem>
                          <SelectItem value="hybrid">Hybrid</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Priority</label>
                      <Select value={prioritySetting} onValueChange={setPrioritySetting}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fcfs">First Come First Served</SelectItem>
                          <SelectItem value="preference">Preference Based</SelectItem>
                          <SelectItem value="random">Random</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-700">Committee Demand Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(allocationAnalysis).map(([committeeId, data]) => (
                      <div key={committeeId} className="flex items-center justify-between p-3 border rounded">
                        <div>
                          <div className="font-medium text-gray-700">{committeeId}</div>
                          <div className="text-sm text-gray-600">{data.interested} interested</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-red-600">
                            {registrations.length > 0 ? ((data.interested / registrations.length) * 100).toFixed(1) : 0}
                            %
                          </div>
                          <div className="text-xs text-gray-600">demand</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-gray-700">Allocation Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-gray-700">First Choice Satisfaction</span>
                      <span className="font-bold text-green-600">
                        {stats.firstChoiceSatisfied} / {stats.allocated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-gray-700">Second Choice Satisfaction</span>
                      <span className="font-bold text-yellow-600">
                        {stats.secondChoiceSatisfied} / {stats.allocated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-gray-700">Overall Allocation Rate</span>
                      <span className="font-bold text-blue-600">{stats.allocationRate.toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        {/* Detailed View Modal */}
        <Dialog open={!!selectedRegistration} onOpenChange={() => setSelectedRegistration(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-red-600">Registration Details</DialogTitle>
              <DialogDescription>Complete information for {selectedRegistration?.fullName}</DialogDescription>
            </DialogHeader>
            {selectedRegistration && (
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <p className="text-gray-900">{selectedRegistration.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-gray-900">{selectedRegistration.phoneNumber}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">University</label>
                    <p className="text-gray-900">{selectedRegistration.university}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Committee Preferences</label>
                    <p className="text-gray-900">1st: {selectedRegistration.committeePreference1}</p>
                    <p className="text-gray-900">2nd: {selectedRegistration.committeePreference2}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allocation Status</label>
                    <Badge className={getAllocationStatus(selectedRegistration._id).color}>
                      {getAllocationStatus(selectedRegistration._id).status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Registration Date</label>
                    <p className="text-gray-900">{new Date(selectedRegistration.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default AdminPanel
