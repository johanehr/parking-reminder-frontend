import React from 'react'
import { Button } from './ui/button'

interface IButtonDisplayWindow {
    text: string,
    onClick?: () => void
}

const ButtonDisplayWindow = ({text}: IButtonDisplayWindow) => {
    return <Button className='mt-4' size='sm'>{text}</Button>
}

export default ButtonDisplayWindow