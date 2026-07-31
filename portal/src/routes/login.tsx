import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: About,
})

function About() {
  return <div className="p-2">Login Page!</div>
}