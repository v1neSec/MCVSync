import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome to Client Ordering Portal</h3>
      <Link to="/login" className="[&.active]:font-bold">
        Login
      </Link>
    </div>
  )
}