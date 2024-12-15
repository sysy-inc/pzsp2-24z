import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(app)/platform/$platformId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/platform/$platformId"!</div>
}
