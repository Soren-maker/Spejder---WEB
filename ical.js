// Vercel-funktion: henter jeres iCal-feed fra Medlemsservice og sender det videre til hjemmesiden.
// Det løser, at browseren ikke må hente feedet direkte fra et andet domæne.
const FEED = 'https://medlemsservice.spejdernet.dk/ical?orgs=2237';

module.exports = async (req, res) => {
  try {
    const r = await fetch(FEED, { headers: { Accept: 'text/calendar' } });
    if (!r.ok) throw new Error('Medlemsservice svarede ' + r.status);
    const text = await r.text();
    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    // Gemmes i 5 minutter hos Vercel, så nye begivenheder dukker hurtigt op
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.status(200).send(text);
  } catch (e) {
    res.status(502).send('Kunne ikke hente kalenderen');
  }
};
