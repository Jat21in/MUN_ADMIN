"use client"

import { useEffect, useState, useMemo } from "react"
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
import {
  Users,
  Mail,
  Calendar,
  Search,
  Download,
  CheckCircle,
  MoreHorizontal,
  AlertTriangle,
  Eye,
  AlertCircle,
  Globe,
  Award,
  Clock,
  Shuffle,
  FileText,
} from "lucide-react"

// Committee and Country Configuration
const COMMITTEES = {
  UNGA: {
    name: "United Nations General Assembly",
    capacity: 50,
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
    capacity: 30,
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
    capacity: 20,
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
    capacity: 35,
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
    capacity: 40,
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
    capacity: 45,
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
  const [filterType, setFilterType] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("asc")
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [showDuplicatesOnly, setShowDuplicatesOnly] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [activeTab, setActiveTab] = useState("registrations")
  const [selectedCommittee, setSelectedCommittee] = useState("UNGA")
  const [allocationMode, setAllocationMode] = useState("manual")

  useEffect(() => {
    axios
      .get("https://mun-panel-backend.onrender.com/api/registrations")
      .then((res) => {
        const sortedData = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        setRegistrations(sortedData)
      })
      .catch((err) => console.error(err))
  }, [])

  // Allocation Logic
  const allocationAnalysis = useMemo(() => {
    const analysis = {}

    Object.keys(COMMITTEES).forEach((committeeId) => {
      const committee = COMMITTEES[committeeId]
      const allocated = Object.values(allocations).filter((a) => a.committee === committeeId)
      const waitlist = []
      const available = committee.capacity - allocated.length

      // Get registrations who preferred this committee
      const interested = registrations
        .filter((r) => r.committeePreference1 === committee.name || r.committeePreference2 === committee.name)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

      // Separate first and second preferences
      const firstChoice = interested.filter((r) => r.committeePreference1 === committee.name)
      const secondChoice = interested.filter((r) => r.committeePreference2 === committee.name)

      analysis[committeeId] = {
        ...committee,
        allocated: allocated.length,
        available,
        interested: interested.length,
        firstChoice: firstChoice.length,
        secondChoice: secondChoice.length,
        waitlist: waitlist.length,
        fillPercentage: (allocated.length / committee.capacity) * 100,
        registrations: interested,
        allocatedCountries: allocated.map((a) => a.country),
        availableCountries: committee.countries.filter((c) => !allocated.map((a) => a.country).includes(c)),
      }
    })

    return analysis
  }, [registrations, allocations])

  // Auto-allocation function
  const performAutoAllocation = () => {
    const newAllocations = { ...allocations }
    const processed = new Set()

    // Sort registrations by creation date (first-come-first-served)
    const sortedRegistrations = [...registrations].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))

    sortedRegistrations.forEach((registration) => {
      if (processed.has(registration._id) || newAllocations[registration._id]) return

      // Try first preference
      const firstPref = Object.keys(COMMITTEES).find((id) => COMMITTEES[id].name === registration.committeePreference1)

      if (firstPref && allocationAnalysis[firstPref]?.available > 0) {
        const availableCountries = allocationAnalysis[firstPref].availableCountries
        if (availableCountries.length > 0) {
          newAllocations[registration._id] = {
            committee: firstPref,
            country: availableCountries[0],
            preference: 1,
            allocatedAt: new Date().toISOString(),
            status: "allocated",
          }
          processed.add(registration._id)
          return
        }
      }

      // Try second preference
      const secondPref = Object.keys(COMMITTEES).find((id) => COMMITTEES[id].name === registration.committeePreference2)

      if (secondPref && allocationAnalysis[secondPref]?.available > 0) {
        const availableCountries = allocationAnalysis[secondPref].availableCountries
        if (availableCountries.length > 0) {
          newAllocations[registration._id] = {
            committee: secondPref,
            country: availableCountries[0],
            preference: 2,
            allocatedAt: new Date().toISOString(),
            status: "allocated",
          }
          processed.add(registration._id)
          return
        }
      }

      // Add to waitlist if no allocation possible
      newAllocations[registration._id] = {
        committee: null,
        country: null,
        preference: null,
        allocatedAt: new Date().toISOString(),
        status: "waitlist",
      }
    })

    setAllocations(newAllocations)
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

  // Enhanced filtering and sorting
  const processedRegistrations = useMemo(() => {
    const filtered = registrations.filter((registration) => {
      const matchesSearch =
        registration.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.university?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.phoneNumber?.includes(searchTerm)

      const matchesFilter = filterType === "all" || registration.delegateType === filterType
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

    return {
      total,
      allocated,
      waitlisted,
      pending,
      allocationRate: total > 0 ? (allocated / total) * 100 : 0,
      duplicates: duplicateAnalysis.totalDuplicates,
    }
  }, [registrations, allocations, duplicateAnalysis])

  const getDelegateTypeBadge = (type) => {
    const colors = {
      Delegate: "bg-blue-100 text-blue-800",
      Chair: "bg-red-100 text-red-800",
      Observer: "bg-gray-100 text-gray-800",
      Press: "bg-green-100 text-green-800",
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
                onClick={exportAllocations}
                className="text-gray-700 hover:text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Allocations
              </Button>
              <Button onClick={performAutoAllocation} className="bg-red-600 hover:bg-red-500 text-white">
                <Shuffle className="w-4 h-4 mr-2" />
                Auto Allocate
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.total}</div>
              <p className="text-xs text-gray-600">Registrations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Allocated</CardTitle>
              <CheckCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.allocated}</div>
              <p className="text-xs text-gray-600">{stats.allocationRate.toFixed(1)}% rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Waitlisted</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.waitlisted}</div>
              <p className="text-xs text-gray-600">Pending spots</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Pending</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
              <p className="text-xs text-gray-600">Not processed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Committees</CardTitle>
              <Globe className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{Object.keys(COMMITTEES).length}</div>
              <p className="text-xs text-gray-600">Available</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Duplicates</CardTitle>
              <AlertTriangle className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.duplicates}</div>
              <p className="text-xs text-gray-600">To review</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="registrations">Registrations</TabsTrigger>
            <TabsTrigger value="allocations">Committee Allocation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

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
                                      <strong>Preference:</strong> {allocation.preference === 1 ? "1st" : "2nd"} Choice
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
                      <Select defaultValue="fcfs">
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
                            {((data.interested / registrations.length) * 100).toFixed(1)}%
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
                        {Object.values(allocations).filter((a) => a.preference === 1).length} / {stats.allocated}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span className="text-gray-700">Second Choice Satisfaction</span>
                      <span className="font-bold text-yellow-600">
                        {Object.values(allocations).filter((a) => a.preference === 2).length} / {stats.allocated}
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
