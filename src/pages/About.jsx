export default function About() {
  return (
    <section className="max-w-lg mx-auto p-6 text-[#121212] text-sm leading-relaxed">
      <h1 className="text-2xl font-bold text-center mb-6">
        An online habit tracker to build better routines, one day at a time.
      </h1>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-2">What is HabiTrack?</h2>
          <p className="text-[#1e1e1e]">
            HabiTrack is a free web app designed to help you build and maintain daily habits.
            It gives you a visual way to check off goals and stay consistent over time.
            Whether you're trying to drink more water, work out, or write daily, HabiTrack keeps you on track and motivated.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">What is Habit Tracking?</h2>
          <p className="text-[#1e1e1e]">
            Habit tracking is the simple act of marking down when you complete a habit, and is one of the most effective ways to stay consistent.
            By tracking your progress, you turn your goals into daily actions and build lasting routines.
            It’s a proven strategy to boost focus, motivation, and self-discipline.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How to Use HabiTrack</h2>
          <ol className="text-[#1e1e1e] list-decimal list-inside space-y-1">
            <li>Add the habits you want to build.</li>
            <li>Select the days you want to complete them (e.g. Mon–Fri).</li>
            <li>Check them off each day, build your streaks, and don’t break the chain.</li>
          </ol>

          <div className="w-full flex justify-center">
            <img
              src={`${import.meta.env.BASE_URL}about/Demo.gif`}
              alt="HabiTracker Demo"
              className="max-w-full shadow-md mt-6"
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Features</h2>
          <ul className="text-[#1e1e1e] list-disc list-inside space-y-2">
            <li>
              Habit Calendar: Track your habits on a weekly or monthly calendar view.
              Easily check off completed days and visualize your consistency over time.
            </li>
            <li>
              Habit Management: Create, update, delete, or reorder your habits.
              Choose active days, pick a color, and organize them to suit your routine.
            </li>
            <li>
              Detailed Overview: View your progress with stats like streaks,
              completion rate, most productive days, and more.
            </li>
            <li>
              Smart Settings: Customize the app to your preferences.
              Set your tracking start date, toggle color coding, and control whether habits
              are editable directly on the tracker.
            </li>
            <li>
              Sync and Access Anywhere: Log in to save your habits and access them
              from any device. Your data stays safe and portable.
              Prefer to stay offline? You can use the app without logging in too.
            </li>
          </ul>
        </section>
      </div>
    </section>
  );
}