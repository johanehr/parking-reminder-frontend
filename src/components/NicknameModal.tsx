import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function NicknameModal() {
  return (
    <Dialog defaultOpen>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MessageCircleQuestionIcon className="w-4 h-4 text-blue-400" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[80%] sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Car nicknames</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          A car nickname can help you identify which car your notification is referencing. Making cancellations nice and easy!
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

function MessageCircleQuestionIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  )
}