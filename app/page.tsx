import SnakeAndLadder from "@/components/snake-and-ladder"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="mb-8 text-center text-3xl font-bold md:text-4xl">Snake and Ladder</h1>
      <SnakeAndLadder />
    </main>
  )
}

