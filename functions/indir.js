export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Linkten gelen parametreyi al (Örn: ?doz=1)
  const doz = url.searchParams.get('doz') || '1';
  const title = doz === '1' ? 'Post-1st Dose Reminder' : 'Post-2nd Dose Reminder';

  // 3 Ay sonrasını sabah 09:00 olarak hesapla
  const today = new Date();
  const reminderDate = new Date(today.setMonth(today.getMonth() + 3));
  reminderDate.setHours(9, 0, 0, 0);

  const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const start = formatDate(reminderDate);
  const endDate = new Date(reminderDate.getTime() + 15 * 60000);
  const end = formatDate(endDate);

  // ICS İçeriği (PRODID kısmına şirket ismini zarifçe ekledim)
  const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Novartis//Dose Reminder//EN\r\nBEGIN:VEVENT\r\nDTSTART:${start}\r\nDTEND:${end}\r\nSUMMARY:Lyptimzia Doz Hatırlatıcısı\r\nDESCRIPTION:${title} - Sıradaki Lyptimzia dozunuzu alma tarihiniz gelmiştir.\r\nBEGIN:VALARM\r\nTRIGGER:-PT15M\r\nACTION:DISPLAY\r\nDESCRIPTION:Medication Reminder\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;

  // Tarayıcıya "Bu bir sayfa değil, hemen indirilecek bir dosyadır" emrini veriyoruz
  return new Response(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="lyptimzia_doz_hatirlaticisi.ics"',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
