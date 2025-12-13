export default function ColourPreviewPage() {
  const options = [
    {
      name: "Option 1: Neutral Dark Gray",
      foreground: "hsl(0 0% 20%)",
      description: "No color tint, pure gray",
    },
    {
      name: "Option 2: Blue-tinted Gray",
      foreground: "hsl(220 15% 20%)",
      description: "Matches Navy Blue primary",
    },
    {
      name: "Option 3: Near Black",
      foreground: "hsl(0 0% 10%)",
      description: "Very dark, high contrast",
    },
  ];

  const primary = "hsl(240 63% 27%)"; // Navy Blue

  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="mb-8 font-bold text-2xl">Foreground Colour Options</h1>

      <div className="mb-8 rounded-lg bg-gray-100 p-4">
        <p className="text-sm">
          <strong>Primary (Navy Blue):</strong>{" "}
          <span
            className="inline-block rounded px-2 py-1 text-white"
            style={{ backgroundColor: primary }}
          >
            {primary}
          </span>
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {options.map((option) => (
          <div key={option.name} className="rounded-xl border p-6 shadow-sm">
            <div
              className="mb-4 h-16 w-full rounded-lg"
              style={{ backgroundColor: option.foreground }}
            />

            <h2
              className="mb-2 font-semibold text-xl"
              style={{ color: option.foreground }}
            >
              {option.name}
            </h2>

            <p className="mb-4 text-sm" style={{ color: option.foreground }}>
              {option.description}
            </p>

            <code className="block rounded bg-gray-100 p-2 text-xs">
              {option.foreground}
            </code>

            {/* Typography preview */}
            <div className="mt-6 border-t pt-4">
              <h3
                className="mb-2 font-semibold text-4xl tracking-tight"
                style={{ color: option.foreground }}
              >
                COE Overview
              </h3>
              <h4
                className="mb-2 font-semibold text-3xl"
                style={{ color: option.foreground }}
              >
                Section Title
              </h4>
              <h5
                className="mb-2 font-medium text-2xl"
                style={{ color: option.foreground }}
              >
                Card Title
              </h5>
              <p className="mb-4" style={{ color: option.foreground }}>
                This is body text showing how paragraphs will look with this
                foreground colour. The quick brown fox jumps over the lazy dog.
              </p>
              <p
                className="text-sm opacity-60"
                style={{ color: option.foreground }}
              >
                Secondary text with reduced opacity
              </p>
            </div>

            {/* With Primary Button */}
            <div className="mt-6 border-t pt-4">
              <p className="mb-2 text-gray-500 text-xs">With Primary Button:</p>
              <button
                type="button"
                className="rounded-full px-4 py-2 text-white"
                style={{ backgroundColor: primary }}
              >
                Primary Action
              </button>
              <span className="ml-3" style={{ color: option.foreground }}>
                Adjacent text
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Current comparison */}
      <div className="mt-12 rounded-xl border-2 border-orange-300 border-dashed p-6">
        <h2 className="mb-4 font-semibold text-orange-600 text-xl">
          Current (Dark Slate Gray - greenish tint)
        </h2>
        <div
          className="mb-4 h-16 w-32 rounded-lg"
          style={{ backgroundColor: "hsl(180 25% 25%)" }}
        />
        <h3
          className="mb-2 font-semibold text-4xl tracking-tight"
          style={{ color: "hsl(180 25% 25%)" }}
        >
          COE Overview
        </h3>
        <p style={{ color: "hsl(180 25% 25%)" }}>
          This is the current foreground with the teal/cyan hue causing the
          greenish appearance.
        </p>
        <code className="mt-2 block rounded bg-gray-100 p-2 text-xs">
          hsl(180 25% 25%)
        </code>
      </div>
    </div>
  );
}
