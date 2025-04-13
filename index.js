addEventListener("fetch", event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    if (request.method === "POST") {
      const { zip, size, pets, kids, disaster } = await request.json();
      const prompt = `You’re a disaster prep expert. For a ${disaster} in ${zip}, ${size} people, ${pets ? "yes" : "no"} pets, ${kids ? "yes" : "no"} kids, suggest a 3-item preparedness plan as a checklist (e.g., "- Item") and one evacuation tip in 50 words or less, 2025 context. List specific, practical items or actions.`;
      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer AIzaSyA6o3icQJLB83VQtTUkMzKKXRloKzdfRus"
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });
        const data = await response.json();
        const advice = data.candidates[0].content.parts[0].text.trim();
        return new Response(JSON.stringify({ advice }), {
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "max-age=300"
          }
        });
      } catch (e) {
        return new Response(JSON.stringify({ advice: "API error, try again." }), { status: 500 });
      }
    }
    return new Response("Use POST", { status: 405 });
  }