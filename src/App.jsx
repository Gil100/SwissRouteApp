import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// נתוני המסלול
const itinerary = {
  "30/5/25": [
    { time: "09:30", title: "Staubbach Falls", desc: "מפלים גבוהים בעמק לאוטרברונן", location: [46.5939, 7.9098] },
    { time: "10:30", title: "Trümmelbach Falls", desc: "מפלים תת-קרקעיים בתוך ההר", location: [46.561, 7.906] },
    { time: "12:00", title: "Mürren Viewpoint", desc: "עיירה ללא רכבים ונוף מדהים", location: [46.5587, 7.8925] }
  ],
  "31/5/25": [
    { time: "09:30", title: "Firstbahn", desc: "רכבל לגרינדלוולד – כולל Cliff Walk", location: [46.6242, 8.0414] },
    { time: "11:00", title: "Bachalpsee", desc: "אגם הרים יפהפה במסלול הליכה קל", location: [46.664, 8.023] }
  ],
  "1/6/25": [
    { time: "10:30", title: "Titlis", desc: "הר הקרחונים עם רכבל מסתובב ומערת קרח", location: [46.7722, 8.437] }
  ],
  "2/6/25": [
    { time: "09:50", title: "Aare Gorge", desc: "קניון מרשים לאורך הנהר", location: [46.725, 8.207] },
    { time: "11:15", title: "Rosenlaui Gorge", desc: "קניון קרחוני פראי ויפהפה", location: [46.6663, 8.1292] },
    { time: "13:00", title: "Lucerne – Chapel Bridge", desc: "גשר הקפלה בעיר העתיקה של לוצרן", location: [47.0516, 8.3074] },
    { time: "14:00", title: "Lion Monument", desc: "פסל האריה בלוצרן", location: [47.0586, 8.3105] }
  ],
  "3/6/25": [
    { time: "10:00", title: "Kleine Scheidegg", desc: "תצפית נוף בתחנת הרכבת ההררית", location: [46.5853, 7.9616] },
    { time: "16:30", title: "Harder Kulm", desc: "תצפית שקיעה מעל אינטרלאקן", location: [46.6908, 7.8541] }
  ],
  "4/6/25": [
    { time: "10:00", title: "Spiez Castle", desc: "טירה ציורית על שפת האגם", location: [46.6837, 7.6917] },
    { time: "11:30", title: "Blausee", desc: "אגם קטן עם מים טורקיז", location: [46.5449, 7.6906] },
    { time: "13:00", title: "Oeschinensee", desc: "אגם הרים עם רכבל ונוף עוצר נשימה", location: [46.498, 7.713] }
  ],
  "5/6/25": [
    { time: "09:30", title: "Schynige Platte", desc: "רכבת נוף לפסגה וגן אלפיני", location: [46.6595, 7.9075] },
    { time: "15:30", title: "Thun Castle", desc: "טירה בעיר העתיקה עם נוף לאגם", location: [46.7573, 7.627] }
  ],
  "6/6/25": [
    { time: "10:00", title: "Täsch Terminal", desc: "חניון רכבים ותחנת רכבת ל-Zermatt", location: [46.0735, 7.7803] },
    { time: "10:30", title: "Zermatt Center", desc: "עיירה אלפינית ייחודית ללא רכבים", location: [46.0207, 7.7491] },
    { time: "12:00", title: "Matterhorn Viewpoint", desc: "תצפית על המטרהורן ממרכז זרמט", location: [46.0204, 7.7411] },
    { time: "13:00", title: "Sunnegga Funicular (אופציונלי)", desc: "רכבל קצר לנוף מרהיב", location: [46.0272, 7.7495] }
  ],
  "7/6/25": [
    { time: "10:00", title: "Gelmerbahn", desc: "הרכבל התלול ביותר באירופה", location: [46.6164, 8.3242] },
    { time: "11:00", title: "Gelmersee Loop", desc: "מסלול הליכה סביב אגם Gelmer", location: [46.609, 8.328] }
  ]
};

// רכיב שמוסיף סמנים מותאמים אישית למפה
function CustomMarkers({ locations }) {
  const map = useMap();
  
  useEffect(() => {
    // הסרת כל הסמנים הקיימים מהמפה
    map.eachLayer(layer => {
      if (layer._latlng) { // בדיקה אם זה סמן
        map.removeLayer(layer);
      }
    });
    
    // הוספת שכבת ה-TileLayer מחדש (אחרי שהסרנו את כל השכבות)
    const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    
    // יצירת סמנים חדשים עם HTML מותאם אישית
    if (locations && locations.length > 0) {
      locations.forEach(location => {
        // יצירת אלמנט HTML עבור הסמן
        const markerHtml = document.createElement('div');
        markerHtml.className = 'custom-marker';
        markerHtml.style.backgroundColor = '#1976D2';
        markerHtml.style.width = '14px';
        markerHtml.style.height = '14px';
        markerHtml.style.borderRadius = '50%';
        markerHtml.style.border = '2px solid white';
        markerHtml.style.boxShadow = '0 0 4px rgba(0,0,0,0.5)';
        
        // יצירת אייקון מותאם אישית
        const customIcon = L.divIcon({
          html: markerHtml,
          className: 'custom-marker-icon',
          iconSize: [18, 18],
          iconAnchor: [9, 9]
        });
        
        // יצירת הסמן והוספתו למפה
        const marker = L.marker(location.location, { icon: customIcon })
          .addTo(map)
          .bindPopup(`<strong>${location.title}</strong><br>${location.desc}`);
      });
    }
    
    // איפוס תצוגת המפה למרכז שווייץ אם אין מיקומים
    if (!locations || locations.length === 0) {
      map.setView([46.7, 8.2], 9);
    } 
    // מרכוז המפה לראות את כל המיקומים אם יש כאלה
    else if (locations.length === 1) {
      map.setView(locations[0].location, 13);
    } 
    else {
      const bounds = locations.map(loc => loc.location);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
    
    // ניקוי כאשר הקומפוננטה מתפרקת
    return () => {
      map.eachLayer(layer => {
        if (layer._latlng) {
          map.removeLayer(layer);
        }
      });
    };
  }, [map, locations]);

  return null;
}

// הקומפוננטה הראשית
export default function App() {
  const [day, setDay] = useState("30/5/25");
  
  // לוודא שיש L מוגדר עבור הסמנים המותאמים אישית
  const L = window.L;

  return (
    <div style={{ padding: "1rem", fontFamily: "sans-serif", direction: "rtl" }}>
      <h1>🇨🇭 טיול שווייץ 2025 – 29/5 עד 8/6</h1>
      <label htmlFor="day-select">בחר יום:</label>
      <select
        id="day-select"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        style={{ padding: "0.5rem", margin: "0.5rem 0" }}
      >
        {Object.keys(itinerary).map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <ul style={{ paddingInlineStart: "20px" }}>
        {itinerary[day].map((item, idx) => (
          <li key={idx} style={{ marginBottom: "1rem" }}>
            <strong>{item.time} – {item.title}</strong><br />
            {item.desc}<br />
            <a
              href={`https://www.google.com/maps?q=${item.location[0]},${item.location[1]}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              ניווט בגוגל מפות
            </a>
          </li>
        ))}
      </ul>

      <div style={{ height: "400px", marginTop: "1rem", borderRadius: "12px", overflow: "hidden" }}>
        <MapContainer 
          center={[46.7, 8.2]} 
          zoom={9} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <CustomMarkers locations={itinerary[day]} />
        </MapContainer>
      </div>
    </div>
  );
}
