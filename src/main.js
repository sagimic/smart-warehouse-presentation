import './style.css';
import { setupWarehouses, simulationMarkup } from './warehouse.js';

const card = (title, text, number = '') => `<article class="card">${number ? `<span class="card-number">${number}</span>` : ''}<h3>${title}</h3><p>${text}</p></article>`;
const callout = text => `<p class="callout">${text}</p>`;
const reserve = (description, labels = ['מדפים', 'מוצרים', 'מעברים', 'רובוט']) => `<aside class="warehouse-reserve" aria-label="אזור שמור למחסן תלת־ממדי עתידי"><span class="reserve-icon" aria-hidden="true">▦</span><span class="tag">בשלב הפיתוח הבא</span><h3>כאן יוצג המחסן התלת־ממדי</h3><p>${description}</p><div class="chips">${labels.map(label => `<span>${label}</span>`).join('')}</div><small>אזור שמור בלבד · אין סימולציה פעילה בגרסה זו</small></aside>`;
const slides = [
  {
    section: 'מתחילים מההזמנה', title: 'המחסן החכם', subtitle: 'מסע ההזמנה בעידן הבינה המלאכותית',
    body: `<div class="split hero"><div><p class="lead">לחצנו על ״הזמנה״.<br>מה קורה עד שהחבילה יוצאת לדרך?</p><p>נעקוב אחר הזמנה אחת ונבחן כיצד מידע, תכנון ואנשים מחברים בין המדף ללקוח.</p><div class="journey"><span>קליטה</span><i>←</i><span>ליקוט</span><i>←</i><span>אריזה</span><i>←</i><span>משלוח</span></div>${callout('שאלת המפתח: איך בוחרים דרך יעילה ובטוחה לאיסוף המוצרים?')}</div>${reserve('מדפים, מוצרים ורובוט יציגו בהמשך את מסע ההזמנה.')}</div>`
  },
  {
    section: 'הבעיה התפעולית', title: 'האתגרים במחסן המסורתי', subtitle: 'לפני שבוחרים טכנולוגיה, צריך להבין את התהליך.',
    body: `<div class="cards three">${card('מרחק וזמן', 'סדר איסוף לא מתוכנן עלול לגרום להליכה חוזרת בין אותם מדפים.', '01')}${card('דיוק ומידע', 'קושי באיתור פריטים או מידע לא מעודכן עלולים להוביל לטעויות ליקוט.', '02')}${card('שינויים בשטח', 'מעבר חסום, עומס או שינוי בביקוש מחייבים התאמה של תוכנית העבודה.', '03')}</div>${callout('האתגר הניהולי: לתאם בין המלאי, העובדים וההזמנות — גם כשהתנאים משתנים.')}`
  },
  {
    section: 'שלושה מושגים שונים', title: 'מה הופך מחסן לחכם?', subtitle: 'אוטומציה, מציאת מסלול ובינה מלאכותית ממלאות תפקידים שונים.',
    body: `<div class="cards three concepts">${card('אוטומציה', 'ביצוע פעולה לפי כללים שהוגדרו מראש. למשל: שליחת משימת ליקוט אחרי קליטת הזמנה.', '01')}${card('אלגוריתם למציאת מסלול', 'חישוב דרך במפה לפי נקודות יעד ומכשולים. למשל: בחירת דרך פנויה בין מדפים.', '02')}${card('בינה מלאכותית', 'מערכת שיכולה ללמוד דפוסים מנתונים. למשל: מודל שמעריך ביקוש עתידי על סמך נתוני עבר.', '03')}</div>${callout('מציאת מסלול אינה בהכרח בינה מלאכותית. ההדגמה המתוכננת תשתמש בכללים ובאלגוריתמים, ללא מודל מאומן.')}`
  },
  {
    section: 'מהזמנה לאריזה', title: 'מסע של הזמנה אחת', subtitle: 'הזמנת הדגמה: מחברת, אוזניות ובקבוק.',
    body: `<div class="split"><div class="steps">${card('קליטה ואיתור', 'ההזמנה נקלטת וכל מוצר מקושר למיקומו במחסן.', '1')}${card('תכנון וליקוט', 'מתכננים דרך בין נקודות האיסוף ואוספים את שלושת המוצרים.', '2')}${card('חזרה ואריזה', 'חוזרים לעמדת האריזה, בודקים את התכולה ומכינים למשלוח.', '3')}</div>${reserve('הרובוט ינוע במסלול תקין; כל פריט יסומן כאשר ייאסף.', ['מחברת', 'אוזניות', 'בקבוק'])}</div>`
  },
  {
    section: 'משווים באופן הוגן', title: 'אותה הזמנה, שני מסלולי ליקוט', subtitle: 'משנים את סדר האיסוף, ושומרים על אותם תנאי השוואה.',
    body: `<div class="cards two">${card('סדר איסוף קבוע', 'אוספים לפי סדר רשימת ההזמנה. הסדר פשוט לביצוע, אך אינו מתחשב בהכרח במיקום המוצרים.')}${card('סדר איסוף מחושב', 'בודקים סדרי איסוף אפשריים ובוחרים מסלול לפי מרחקי הרשת והמכשולים.')}</div><div class="comparison-note"><strong>אותם מוצרים · אותה תחנת אריזה · אותם מכשולים</strong><p>נמדוד את המסלול המלא: יציאה, איסוף וחזרה. גם תוצאה שווה היא תוצאה תקינה.</p><span class="metric">אורך המסלול: לא זמין — יחושב בשלב הסימולציה</span><small>יחידת הדגמה אחת = מעבר בין שני תאי רשת סמוכים; אינה מטר במציאות.</small></div>`
  },
  {
    section: 'איפה בינה מלאכותית יכולה לסייע?', title: 'חיזוי ביקוש ומיקום מוצרים', subtitle: 'מנתוני עבר להחלטות על מלאי וסידור המחסן.',
    body: `<div class="cards three">${card('לזהות דפוסים', 'הזמנות לאורך זמן עשויות לחשוף עונתיות או שינוי בביקוש למוצר.', '1')}${card('להעריך ביקוש', 'מודל מאומן יכול להציע תחזית. צריך לבדוק את איכותה מול נתונים שלא שימשו לאימון.', '2')}${card('לתמוך בהחלטה', 'אפשר לשקול קירוב מוצרים מבוקשים לאריזה, לצד מגבלות מקום, בטיחות ומשקל.', '3')}</div>${callout('דוגמה רעיונית בלבד: אם מחברות מוזמנות לעיתים קרובות, אפשר לשקול מיקום נגיש יותר. זו אינה תחזית שחושבה בפרויקט.')}<p class="data-note">נתוני הדגמה בלבד — אינם נתונים ממחסן אמיתי. בגרסה זו אין מודל מאומן או חיזוי פעיל.</p>`
  },
  {
    section: 'בחירת הקהל', title: 'עכשיו אתם בוחרים את ההזמנה', subtitle: 'בחרו אחת משלוש הזמנות ההדגמה כדי לראות את הרכב המוצרים שלה.',
    body: `<div class="split"><div><fieldset class="orders"><legend>איזו הזמנה נרצה ללקט?</legend>${[['מחברת, אוזניות ובקבוק', 'מחברת · אוזניות · בקבוק'], ['מחברת ובקבוק', 'מחברת · בקבוק'], ['אוזניות ובקבוק', 'אוזניות · בקבוק']].map(([label, products], i) => `<label class="order"><input type="radio" name="order" value="${i}" aria-label="הזמנה ${i + 1}: ${label}"><span><strong>הזמנה ${i + 1}</strong><small>${products}</small></span></label>`).join('')}</fieldset><p id="order-summary" class="selection-summary" role="status">טרם נבחרה הזמנה.</p><div class="simulation-controls" aria-label="פקדי סימולציה עתידיים">${['התחלה', 'השהיה', 'המשך', 'איפוס'].map(label => `<button disabled>${label}</button>`).join('')}</div><small class="muted">בחירת ההזמנה פעילה. תנועה, הדגשת מוצרים ופקדי הסימולציה יתווספו בשלב הבא.</small></div>${reserve('המוצרים בהזמנה שנבחרה יודגשו כאן בהמשך, והרובוט ינוע בין נקודות האיסוף.')}</div>`
  },
  {
    section: 'מתכננים מחדש', title: 'מה קורה כשמעבר נחסם?', subtitle: 'תוכנית טובה חייבת להתמודד גם עם דרך שאינה פנויה.',
    body: `<div class="split"><div class="steps">${card('מעדכנים את המפה', 'מסמנים מעבר מוגדר כחסום. הרובוט אינו רשאי לעבור דרכו או דרך מדפים.', '1')}${card('מחפשים חלופה', 'מחשבים מחדש דרך לנקודות האיסוף ולעמדת האריזה, ומעדכנים את האורך.', '2')}${card('עוצרים כשאין דרך', 'אם אחד היעדים אינו נגיש, לא מתחילים תנועה. פותחים מעבר או בוחרים הזמנה אחרת.', '3')}<p class="example-message"><strong>הודעה מתוכננת למצב ללא מסלול:</strong><br>לא נמצא מסלול תקין להזמנה זו. יש לפתוח מעבר או לבחור הזמנה אחרת.</p></div>${reserve('בשלב הבא ניתן יהיה לחסום מעבר מסומן אחד ולראות מסלול חלופי, אם הוא קיים.', ['מעבר מסומן', 'חסימה', 'מסלול חלופי'])}</div>`
  },
  {
    section: 'מבט ניהולי', title: 'יתרונות, מגבלות ותפקיד האדם', subtitle: 'הטכנולוגיה תומכת בתהליך; אנשים קובעים את מטרותיו ומפקחים עליו.',
    body: `<div class="cards three">${card('מה אפשר לשפר?', 'תכנון תנועות, מעקב אחר ביצוע וזיהוי חריגים יכולים לסייע ליעילות ולבקרה.')}${card('מה מגביל את הפתרון?', 'נתונים שגויים, עלויות, תקלות ומגבלות בטיחות עלולים לפגוע בתוצאה.')}${card('מה נשאר בידי האדם?', 'הגדרת יעדים, בדיקת המלצות, טיפול במצבים חריגים ופיקוח על עבודה בטוחה.')}</div>${callout('הדגמת רשת קטנה אינה מערכת לניהול מחסן אמיתי: היא אינה מייצגת עומסים, כמה רובוטים או את כל אילוצי השטח.')}`
  },
  {
    section: 'מהאפיון לגרסה ראשונה', title: 'איך בניתי עם קודקס ומה למדתי', subtitle: 'עבודה עם כלי בינה מלאכותית דורשת הנחיות ברורות ובדיקה עצמאית.',
    body: `<div class="cards two">${card('תהליך העבודה', 'הגדרתי דרישות במסמך אפיון, חילקתי את העבודה לשלבים וביקשתי תחילה מצגת שניתן לבדוק לפני הוספת המחסן התלת־ממדי.')}${card('הכלים בגרסה זו', 'דפי רשת, עיצוב ותכנות בדפדפן בעזרת וייט. קודקס סייע ביצירת הקוד; ספריית התלת־ממד תתווסף בהמשך.')}${card('האחריות שלי', 'להבין את הקוד והתוכן, לבדוק את התוצאה, לזהות טעויות ולבחור אילו הצעות לקבל.')}${card('תובנה מהתהליך', 'כדאי להפריד בין כלי בינה מלאכותית שעוזר בפיתוח לבין התנהגות התוכנה שנבנית. חישוב מסלול אינו הוכחה ללמידה מנתונים.')}</div><p class="data-note">המצב כעת: גרסת שקופיות ראשונה. הסימולציה, צילומי התוצר ותיעוד השיחות המקורי יושלמו בשלבים הבאים.</p>`
  }
];

slides[3].body = simulationMarkup(false, true);
slides[6].body = simulationMarkup();
slides[7].body = simulationMarkup(true);
slides[6].subtitle = 'בחרו הזמנה, עקבו אחר היעדים המודגשים והפעילו את הרובוט.';
slides[7].subtitle = 'חסמו את המעבר המסומן, בדקו את החלופה והפעילו מחדש.';
slides[4].body += '<div class="comparison-scene"><div class="warehouse-viewport" role="img" aria-label="מחסן עם מסלול ההשוואה הנבחר"></div></div>';
slides[9].body = slides[9].body.replace('ספריית התלת־ממד תתווסף בהמשך.', 'המחסן התלת־ממדי נבנה בעזרת ספריית ת׳רי ג׳יי אס.').replace('המצב כעת: גרסת שקופיות ראשונה. הסימולציה, צילומי התוצר ותיעוד השיחות המקורי יושלמו בשלבים הבאים.', 'המצב כעת: מצגת עם סימולציה לימודית. צילומי תוצר ותיעוד השיחות המקורי טרם נוספו; התובנות האישיות דורשות סקירה שלי.');
document.querySelector('#slides').innerHTML = slides.map((slide, i) => `<section class="slide" id="slide-${i + 1}" aria-labelledby="title-${i + 1}" ${i ? 'hidden' : ''}><div class="slide-heading"><p class="eyebrow"><span>${String(i + 1).padStart(2, '0')}</span> ${slide.section}</p><h1 id="title-${i + 1}" tabindex="-1">${slide.title}</h1><p class="subtitle">${slide.subtitle}</p></div><div class="slide-content">${slide.body}</div></section>`).join('');
document.querySelector('#dots').innerHTML = slides.map((slide, i) => `<button class="dot" data-slide="${i}" aria-label="שקופית ${i + 1}: ${slide.title}"></button>`).join('');
let current = 0;
const sections = [...document.querySelectorAll('.slide')];
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const fullscreen = document.querySelector('#fullscreen');
const warehouses = setupWarehouses();

function show(index, focus = false) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  sections.forEach((section, i) => { section.hidden = i !== current; });
  warehouses.activate(current);
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
  document.querySelector('#counter').textContent = `${current + 1} / ${slides.length}`;
  document.querySelectorAll('.dot').forEach((dot, i) => {
    if (i === current) dot.setAttribute('aria-current', 'step');
    else dot.removeAttribute('aria-current');
  });
  document.querySelector('#announcement').textContent = `שקופית ${current + 1} מתוך ${slides.length}: ${slides[current].title}`;
  history.replaceState(null, '', `#slide-${current + 1}`);
  if (focus) sections[current].querySelector('h1').focus({ preventScroll: true });
  window.scrollTo(0, 0);
}
const readHash = () => {
  const match = location.hash.match(/^#slide-(\d+)$/);
  show(match ? Number(match[1]) - 1 : 0);
};
previous.addEventListener('click', () => show(current - 1, true));
next.addEventListener('click', () => show(current + 1, true));
document.querySelector('#dots').addEventListener('click', event => {
  const dot = event.target.closest('[data-slide]');
  if (dot) show(Number(dot.dataset.slide), true);
});
window.addEventListener('hashchange', readHash);
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('input, textarea, select, [contenteditable="true"]')) return;
  const targets = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: slides.length - 1 };
  if (Object.hasOwn(targets, event.key)) {
    event.preventDefault();
    show(targets[event.key], true);
  }
});
fullscreen.addEventListener('click', async () => {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
    else throw new Error('Unavailable');
  } catch {
    const notice = document.querySelector('#notice');
    notice.textContent = 'הדפדפן אינו מאפשר מסך מלא כרגע. אפשר להמשיך לצפות במצגת בחלון הנוכחי.';
    notice.hidden = false;
    setTimeout(() => { notice.hidden = true; }, 6000);
  }
});
document.addEventListener('fullscreenchange', () => {
  fullscreen.querySelector('span').textContent = document.fullscreenElement ? 'יציאה ממסך מלא' : 'מסך מלא';
});
readHash();
