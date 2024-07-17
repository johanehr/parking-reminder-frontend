import { Button } from "@/components/ui/button"

interface IButtonSecondaryProps {
  text: string
}

export function ButtonSecondary({ text }: IButtonSecondaryProps) {
  return <Button variant="secondary">{text}</Button>
}
