"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { Mail, Copy, Download, Send, Users, Filter, Search, CheckCircle, Award } from "lucide-react"

interface Registration {
  _id: string
  fullName: string
  email: string
  university: string
  phoneNumber: string
  delegateType: string
  committeePreference1: string
  committeePreference2: string
  accommodationRequired: boolean
  agreeToTerms: boolean
  previousExperience: string
  createdAt: string
  updatedAt: string
}

interface EmailManagementProps {
  registrations: Registration[]
  allocations: Record<string, any>
}

const EmailManagement = ({ registrations, allocations }: EmailManagementProps) => {
  const [selectedEmails, setSelectedEmails] = useState<Set<string>>(new Set())
  const [emailFilter, setEmailFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [showComposeDialog, setShowComposeDialog] = useState(false)
  const { toast } = useToast()

  // Filter and search emails
  const filteredRegistrations = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch =
        reg.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.university.toLowerCase().includes(searchTerm.toLowerCase())

      const allocation = allocations[reg._id]

      switch (emailFilter) {
        case "allocated":
          return matchesSearch && allocation?.status === "allocated"
        case "waitlisted":
          return matchesSearch && allocation?.status === "waitlisted"
        case "unallocated":
          return matchesSearch && (!allocation || allocation.status === "pending")
        case "accommodation":
          return matchesSearch && reg.accommodationRequired
        case "experienced":
          return matchesSearch && reg.previousExperience && reg.previousExperience.toLowerCase() !== "none"
        default:
          return matchesSearch
      }
    })
  }, [registrations, allocations, searchTerm, emailFilter])

  // Get all emails as comma-separated string
  const getAllEmails = () => {
    return filteredRegistrations.map((reg) => reg.email).join(", ")
  }

  // Get selected emails as comma-separated string
  const getSelectedEmails = () => {
    return Array.from(selectedEmails).join(", ")
  }

  // Copy emails to clipboard
  const copyEmails = (emails: string) => {
    navigator.clipboard.writeText(emails)
    toast({
      title: "Emails copied!",
      description: `${emails.split(", ").length} email addresses copied to clipboard.`,
    })
  }

  // Export emails to CSV
  const exportEmails = () => {
    const emailsToExport =
      selectedEmails.size > 0
        ? filteredRegistrations.filter((reg) => selectedEmails.has(reg.email))
        : filteredRegistrations

    const csvData = emailsToExport.map((reg) => {
      const allocation = allocations[reg._id]
      return {
        Name: reg.fullName,
        Email: reg.email,
        University: reg.university,
        "Delegate Type": reg.delegateType,
        "Committee Preference 1": reg.committeePreference1,
        "Committee Preference 2": reg.committeePreference2,
        "Allocated Committee": allocation?.committee || "Not Allocated",
        "Allocated Country": allocation?.country || "Not Allocated",
        "Accommodation Required": reg.accommodationRequired ? "Yes" : "No",
        "Previous Experience": reg.previousExperience || "None",
        "Registration Date": new Date(reg.createdAt).toLocaleDateString(),
      }
    })

    const headers = Object.keys(csvData[0] || {})
    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => headers.map((header) => `"${row[header as keyof typeof row]}"`).join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `delegate-emails-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Toggle email selection
  const toggleEmailSelection = (email: string) => {
    const newSelected = new Set(selectedEmails)
    if (newSelected.has(email)) {
      newSelected.delete(email)
    } else {
      newSelected.add(email)
    }
    setSelectedEmails(newSelected)
  }

  // Select all filtered emails
  const selectAllFiltered = () => {
    const allFilteredEmails = new Set(filteredRegistrations.map((reg) => reg.email))
    setSelectedEmails(allFilteredEmails)
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedEmails(new Set())
  }

  // Get allocation status badge
  const getAllocationBadge = (regId: string) => {
    const allocation = allocations[regId]
    if (!allocation || allocation.status === "pending") {
      return <Badge variant="secondary">Unallocated</Badge>
    }
    if (allocation.status === "allocated") {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Allocated
        </Badge>
      )
    }
    if (allocation.status === "waitlisted") {
      return (
        <Badge variant="destructive" className="bg-yellow-100 text-yellow-800">
          Waitlisted
        </Badge>
      )
    }
    return <Badge variant="secondary">Unknown</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Email Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Delegates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredRegistrations.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedEmails.size}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Allocated</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {registrations.filter((reg) => allocations[reg._id]?.status === "allocated").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Management
          </CardTitle>
          <CardDescription>Manage and communicate with all delegates efficiently</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or university..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={emailFilter} onValueChange={setEmailFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter delegates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Delegates</SelectItem>
                <SelectItem value="allocated">Allocated</SelectItem>
                <SelectItem value="waitlisted">Waitlisted</SelectItem>
                <SelectItem value="unallocated">Unallocated</SelectItem>
                <SelectItem value="accommodation">Need Accommodation</SelectItem>
                <SelectItem value="experienced">Experienced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => copyEmails(getAllEmails())}
              disabled={filteredRegistrations.length === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy All Emails ({filteredRegistrations.length})
            </Button>

            <Button
              variant="outline"
              onClick={() => copyEmails(getSelectedEmails())}
              disabled={selectedEmails.size === 0}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Selected ({selectedEmails.size})
            </Button>

            <Button variant="outline" onClick={exportEmails} disabled={filteredRegistrations.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </Button>

            <Dialog open={showComposeDialog} onOpenChange={setShowComposeDialog}>
              <DialogTrigger asChild>
                <Button disabled={selectedEmails.size === 0}>
                  <Send className="h-4 w-4 mr-2" />
                  Compose Email ({selectedEmails.size})
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Compose Email</DialogTitle>
                  <DialogDescription>Send email to {selectedEmails.size} selected delegates</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">To:</label>
                    <div className="text-sm text-muted-foreground mt-1 p-2 bg-muted rounded max-h-20 overflow-y-auto">
                      {getSelectedEmails()}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject:</label>
                    <Input
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      placeholder="Enter email subject..."
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Message:</label>
                    <Textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Enter your message..."
                      rows={8}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setShowComposeDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Here you would integrate with your email service
                        toast({
                          title: "Email functionality",
                          description: "Email composition ready. Integrate with your email service to send.",
                        })
                        setShowComposeDialog(false)
                      }}
                    >
                      Send Email
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Selection Controls */}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={selectAllFiltered} disabled={filteredRegistrations.length === 0}>
              Select All Filtered
            </Button>
            <Button variant="ghost" size="sm" onClick={clearSelection} disabled={selectedEmails.size === 0}>
              Clear Selection
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delegates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Delegate Directory</CardTitle>
          <CardDescription>Select delegates to manage their emails</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedEmails.size === filteredRegistrations.length && filteredRegistrations.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          selectAllFiltered()
                        } else {
                          clearSelection()
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Committee Prefs</TableHead>
                  <TableHead>Accommodation</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((reg) => (
                  <TableRow key={reg._id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmails.has(reg.email)}
                        onCheckedChange={() => toggleEmailSelection(reg.email)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{reg.fullName}</TableCell>
                    <TableCell>{reg.email}</TableCell>
                    <TableCell>{reg.university}</TableCell>
                    <TableCell>{getAllocationBadge(reg._id)}</TableCell>
                    <TableCell className="text-sm">
                      <div>1st: {reg.committeePreference1}</div>
                      <div className="text-muted-foreground">2nd: {reg.committeePreference2}</div>
                    </TableCell>
                    <TableCell>
                      {reg.accommodationRequired ? (
                        <Badge variant="secondary">Required</Badge>
                      ) : (
                        <span className="text-muted-foreground">No</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default EmailManagement
