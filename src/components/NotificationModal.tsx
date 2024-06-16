import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function NotificationModal() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="outline">Open Parking Location</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <div className="grid gap-6">
          <div className="space-y-2">
            <DialogHeader>
              <DialogTitle>Parking Location</DialogTitle>
              <DialogDescription>Find and reserve your parking spot.</DialogDescription>
            </DialogHeader>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="search">Search Locations</Label>
              <Input id="search" placeholder="Enter location" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter email" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="car-nickname">Car Nickname</Label>
              <Input id="car-nickname" placeholder="Enter car nickname" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notification-time">Notification Time</Label>
              <Select name="notification-time" defaultValue="30">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes before</SelectItem>
                  <SelectItem value="30">30 minutes before</SelectItem>
                  <SelectItem value="60">1 hour before</SelectItem>
                  <SelectItem value="120">2 hours before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Reserve Parking</Button>
            <div>
              <Button variant="outline">Cancel</Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}