export type MessagePreset = {
  id: string;
  label: string;
  body: string;
};

export const MESSAGE_PRESETS: MessagePreset[] = [
  {
    id: "islam",
    label: "Islam",
    body: `*Assalamualaikum Warahmatullahi Wabarakatuh*

Kepada Yth. Bapak/Ibu/Saudara/i
*{nama}*

Tanpa mengurangi rasa hormat, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan kami. Detail acara dapat dilihat pada tautan berikut:

{link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.

_Jazakumullah Khairan Katsiran._
*Wassalamualaikum Warahmatullahi Wabarakatuh.*`,
  },
  {
    id: "umum",
    label: "Umum / Netral",
    body: `Kepada Yth. Bapak/Ibu/Saudara/i
*{nama}*

Dengan penuh kebahagiaan, kami mengundang Anda untuk menghadiri acara pernikahan kami. Detail acara dapat dilihat melalui tautan berikut:

{link}

Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.

Terima kasih.`,
  },
  {
    id: "formal",
    label: "Formal",
    body: `Kepada Yth.
Bapak/Ibu/Saudara/i *{nama}*
di tempat

Dengan hormat, melalui pesan ini kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk berkenan hadir pada acara pernikahan kami. Informasi lengkap mengenai acara dapat diakses pada tautan berikut:

{link}

Atas perhatian dan kehadirannya, kami ucapkan terima kasih.`,
  },
];
