import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface IToggleProps {
    text: string
}

export function Toggle({ text }: IToggleProps) {
    return (
        <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">{text}</Label>
        </div>
    )
}