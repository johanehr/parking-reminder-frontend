import { Button } from "@/components/ui/button"

interface IMapButtonProps {
    text: string,
    onClick: () => void
}

export function MapButton({ text, onClick }: IMapButtonProps) {
    return <Button className="m-2 bg-black text-white" variant="outline" onClick={onClick}>{text}</Button>
}
