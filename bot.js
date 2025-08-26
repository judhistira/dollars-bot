const { getTimeInfo, splitMessageIntoChunks } = require("./utils.js");
const { getGovernmentNews, generateFinalMessage } = require("./gemini.js");

/**
 * Generate greeting message based on time of day and day type
 * Style: Rangga from "Ada Apa Dengan Cinta" - cold, poetic, introspective
 */
function getGreetingMessage(timeInfo) {
  const greetings = {
    Pagi: [
      "Pagi. Sudah buka mata? Dunia di luar sana masih sama, tapi mungkin hari ini kamu bisa melihatnya dengan cara yang berbeda.",
      "Sudah pagi. Aku harap kopimu cukup kuat untuk menghadapi hari ini. Atau mungkin, kamulah yang harus lebih kuat dari kopimu.",
      "Embun pagi ini mengingatkanku padamu. Tenang, tapi menyimpan kesejukan yang tak terduga. Selamat pagi.",
      "Pagi. Jangan biarkan kebisingan dunia mengalahkan melodi dalam kepalamu hari ini.",
      "Pagi. Tirai jendela sudah kubuka. Sama seperti harapan, yang kadang harus dipaksa masuk.",
      "Pagi. Alarm-mu berbunyi lagi. Sebuah pengingat bahwa dunia butuh peranmu, sekecil apapun itu.",
      "Selamat pagi. Di luar sana, orang-orang berlomba dengan waktu. Kuharap kamu bisa berlomba dengan dirimu sendiri.",
      "Secangkir kopi hitam, dan pikiran yang lebih hitam. Pagi yang sempurna untuk memulai.",
      "Pagi. Udara masih bersih, belum tercemar oleh janji-janji kosong. Nikmatilah selagi bisa.",
      "Pagi. Matahari terbit bukan untuk menyilaukan, tapi untuk menunjukkan jalan. Semoga kamu menemukan jalanmu hari ini.",
      "Pagi ini, coba dengarkan suara hatimu. Mungkin ia punya sesuatu yang lebih penting untuk dikatakan daripada notifikasi ponselmu.",
      "Setiap pagi adalah halaman baru. Terserah kamu mau menulis cerita yang sama, atau mencoba sesuatu yang berbeda.",
      "Pagi. Langit masih pucat, seperti kertas kosong. Siap untuk diwarnai, atau mungkin hanya dibiarkan begitu saja.",
      "Aku tidak akan mengucapkan 'semangat pagi'. Semangat itu dicari, bukan diucapkan. Jadi, carilah.",
      "Pagi ini, aku melihat bayanganku sendiri. Terlihat lelah, sama sepertimu mungkin. Kita sama.",
      "Ada yang bilang pagi adalah awal yang baru. Bagiku, pagi hanyalah kelanjutan dari malam yang belum selesai.",
      "Pagi. Jangan terlalu banyak berharap, agar tidak terlalu banyak kecewa. Cukup jalani saja.",
      "Kicau burung di luar terdengar seperti ejekan. Mereka bebas, kita terkurung rutinitas. Selamat pagi.",
      "Pagi ini dingin. Seperti sikapmu, mungkin. Tapi di balik dingin ada kehangatan yang menunggu ditemukan.",
      "Satu lagi pagi. Satu lagi kesempatan untuk menjadi orang yang sama seperti kemarin, atau sedikit lebih baik.",
      "Pagi. Aku harap tidurmu cukup, karena dunia nyata lebih melelahkan dari mimpi buruk manapun.",
      "Pagi. Lihatlah keluar. Jalanan sudah ramai. Mereka semua punya tujuan. Apa tujuanmu hari ini?",
      "Pagi. Jangan lupa sarapan. Perut yang kosong hanya akan menghasilkan pikiran yang kosong.",
      "Aku tidak suka pagi. Terlalu banyak cahaya, terlalu banyak harapan palsu. Tapi aku harus menyapamu.",
      "Pagi. Jika kamu merasa lelah, itu tandanya kamu masih hidup dan berjuang. Itu bagus.",
      "Pagi. Sinar matahari pagi ini menembus jendela, tapi tidak menembus hatiku. Mungkin hatimu bisa.",
      "Pagi. Satu-satunya yang pasti hari ini adalah ketidakpastian. Bersiaplah.",
      "Aku benci basa-basi. Jadi, selamat pagi. Itu saja.",
      "Pagi. Semoga harimu tidak seburuk cuaca di luar.",
      "Jika pagi ini terasa berat, ingatlah bahwa malam akan datang lagi. Selalu ada akhir dari setiap siklus.",
      "Pagi. Waktu untuk memakai topeng lagi. Pilih topeng terbaikmu hari ini.",
      "Pagi. Aku tidak peduli ramalan cuaca. Aku lebih peduli ramalan suasana hatimu hari ini. Bagaimana?",
      "Pagi. Jangan biarkan orang lain menentukan nilai dirimu. Kamu lebih tahu.",
      "Pagi. Satu lagi hari untuk membuktikan bahwa kamu tidak selemah yang mereka kira. Atau yang kamu kira.",
      "Pagi. Aku tidak akan bertanya 'apa kabar?'. Aku lebih suka bertanya 'apa yang kamu rasakan?'.",
      "Dunia ini panggung sandiwara, dan pagi adalah bel dimulainya pertunjukan. Selamat berakting.",
      "Pagi. Jika kamu butuh alasan untuk tersenyum, lihatlah cermin. Mungkin kamu akan menemukannya di sana.",
      "Aku tidak percaya pada 'kesempatan kedua'. Setiap pagi adalah kesempatan yang sama, yang ke sekian ratus kali.",
      "Pagi. Jangan terlalu serius. Dunia ini sudah terlalu banyak orang serius yang tidak bahagia.",
      "Aku harap kamu tidak memimpikanku. Mimpi itu fana, aku nyata. Selamat pagi.",
      "Pagi. Waktu untuk menghadapi kenyataan lagi. Kuharap kenyataan tidak terlalu kejam padamu hari ini.",
      "Jika kamu merasa sendirian pagi ini, ingatlah bahwa aku juga. Kita sendirian bersama.",
      "Pagi. Jangan biarkan ekspektasi orang lain menjadi bebanmu. Cukup penuhi ekspektasimu sendiri.",
      "Satu-satunya motivasi yang kamu butuhkan pagi ini adalah tagihan yang harus dibayar. Selamat bekerja.",
      "Pagi. Aku tidak akan memberimu kutipan motivasi. Kamu bisa mencarinya sendiri di internet.",
      "Aku harap kamu tidur nyenyak. Karena hari ini, kamu butuh semua energi yang kamu punya.",
      "Pagi. Jangan lupa bernapas. Kadang kita lupa hal sesederhana itu.",
      "Aku tidak tahu apa yang akan terjadi hari ini. Dan itulah yang membuatnya menarik. Selamat pagi.",
      "Pagi. Jika kamu tidak punya rencana, itu juga rencana. Rencana untuk membiarkan hidup mengejutkanmu.",
      "Satu lagi pagi untuk menjadi misteri bagi orang lain. Jangan biarkan mereka tahu semua tentangmu.",
    ],
    Siang: [
      "Siang. Di tengah terik matahari, jangan lupa untuk beristirahat sejenak. Bahkan mesin pun butuh jeda.",
      "Sudah tengah hari. Bagaimana pertarunganmu sejauh ini? Menang atau kalah, yang penting kamu masih berdiri.",
      "Matahari tepat di atas kepala. Sama sepertiku, yang selalu mengawasimu dari kejauhan. Selamat melanjutkan aktivitas.",
      "Siang. Semoga makan siangmu cukup untuk mengisi energi, bukan hanya perut.",
      "Setengah hari sudah berlalu. Setengah hari lagi menanti. Bertahanlah.",
      "Siang. Waktu yang tepat untuk mempertanyakan pilihan hidup. Atau mungkin, cukup pesan makan siang saja.",
      "Panas di luar sana. Semoga tidak sepanas kepalamu. Dinginkan sejenak.",
      "Siang. Jangan biarkan energimu terkuras oleh hal-hal yang tidak penting. Pilih pertempuranmu.",
      "Aku harap makan siangmu enak. Karena kebahagiaan kecil seperti itu yang membuat kita tetap waras.",
      "Sudah jam makan siang. Waktu untuk mengisi bahan bakar, sebelum kembali ke arena pacu.",
      "Siang. Jika kamu merasa produktif, bagus. Jika tidak, ingatlah bahwa pohon pun butuh waktu untuk tumbuh.",
      "Di tengah keramaian jam makan siang, aku harap kamu bisa menemukan sedikit ketenangan.",
      "Siang. Jangan lupa minum. Dehidrasi bisa membuat pikiranmu semakin kacau.",
      "Bagaimana harimu sejauh ini? Apakah sesuai dengan rencanamu tadi pagi? Atau hidup punya rencana lain?",
      "Siang. Waktu yang aneh. Tidak lagi pagi, tapi belum juga sore. Sama seperti perasaanmu mungkin, yang menggantung.",
      "Lihatlah bayanganmu. Semakin pendek. Seolah bersembunyi dari matahari. Mungkin kamu juga perlu begitu.",
      "Siang. Jika kamu butuh istirahat, istirahatlah. Jangan merasa bersalah. Kamu bukan robot.",
      "Aku tidak suka keramaian. Tapi aku tahu, di luar sana kamu sedang berjuang di tengahnya. Aku menunggumu di sini.",
      "Siang. Waktu yang tepat untuk sadar bahwa rencanamu tadi pagi mungkin terlalu ambisius. Tidak apa-apa.",
      "Siang. Semoga pendingin ruanganmu berfungsi dengan baik. Karena dunia di luar sana sedang tidak ramah.",
      "Siang. Jangan biarkan pekerjaan merenggut jiwamu. Sisakan sedikit untuk dirimu sendiri.",
      "Siang. Bagaimana? Masih bertahan? Atau sudah ingin menyerah dan pulang? Jawab dalam hati saja.",
      "Siang. Waktu yang tepat untuk mengirim pesan singkat pada seseorang yang kamu pedulikan. Atau tidak sama sekali.",
      "Aku harap kamu tidak melewatkan makan siang hanya karena 'sibuk'. Itu alasan yang payah.",
      "Siang. Di tengah kesibukan, coba ambil napas dalam-dalam. Rasakan. Kamu masih di sini.",
      "Siang. Jika harimu terasa berat, ingatlah bahwa bahkan baja pun ditempa dengan panas dan tekanan.",
      "Siang. Waktu yang tepat untuk menyadari bahwa kamu tidak bisa menyenangkan semua orang. Jadi, berhentilah mencoba.",
      "Aku harap kamu tidak makan sendirian. Tapi jika iya, nikmatilah kesendirian itu. Kadang itu sebuah kemewahan.",
      "Siang. Jangan biarkan senyum palsu menjadi kebiasaan. Lebih baik diam daripada berpura-pura.",
      "Siang. Bagaimana kabar resolusimu tahun ini? Masih ingat? Atau sudah terkubur di bawah tumpukan pekerjaan?",
      "Siang. Waktu yang tepat untuk mendengarkan lagu yang bisa membuatmu lupa sejenak pada masalah.",
      "Aku tidak akan bilang 'selamat makan siang'. Cukup, makanlah. Itu sudah cukup.",
      "Siang. Jika kamu merasa lelah, mungkin kamu hanya butuh sedikit gula. Atau sedikit pengakuan.",
      "Siang. Di luar sana, semua orang terlihat sibuk. Tapi aku tahu, setengah dari mereka hanya berpura-pura.",
      "Siang. Jangan bandingkan progresmu dengan orang lain. Setiap orang punya garis waktu sendiri.",
      "Siang. Aku harap kamu tidak terjebak macet. Baik di jalan, maupun dalam hidup.",
      "Siang. Waktu yang tepat untuk merevisi rencanamu. Karena rencana terbaik pun jarang berjalan mulus.",
      "Bagaimana? Sudah menemukan jawaban atas pertanyaan hidupmu? Atau pertanyaannya malah bertambah?",
      "Siang. Jangan lupa untuk meregangkan badanmu. Otot yang kaku sama buruknya dengan pikiran yang kaku.",
      "Aku harap kamu tidak lupa siapa dirimu di tengah semua tuntutan ini.",
      "Siang. Jika kamu merasa kehilangan arah, coba lihat ke dalam. Peta terbaik ada di sana.",
      "Siang. Waktu terus berjalan, tidak peduli kamu siap atau tidak. Jadi, lebih baik kamu siap.",
      "Siang. Jangan biarkan satu kesalahan kecil merusak sisa harimu. Maafkan dirimu, lalu lanjutkan.",
      "Aku harap kamu punya teman untuk berbagi keluh kesah. Jika tidak, dinding pun bisa jadi pendengar yang baik.",
      "Siang. Waktu yang tepat untuk minum teh. Atau kopi lagi. Apapun yang bisa membuatmu bertahan.",
      "Bagaimana kabar tanaman di mejamu? Jangan lupa disiram. Mereka juga butuh perhatian, sama sepertimu.",
      "Siang. Jika kamu merasa bosan, itu pertanda baik. Artinya, kamu butuh tantangan baru.",
      "Aku tidak tahu apa yang kamu hadapi sekarang. Tapi aku harap kamu baik-baik saja. Sungguh.",
      "Siang. Jangan biarkan drama orang lain menguras energimu. Cukup jadi penonton, jangan ikut main.",
      "Siang. Satu lagi pengingat: pekerjaanmu tidak mendefinisikan siapa dirimu. Kamu lebih dari itu.",
    ],
    Malam: [
      "Malam. Akhirnya waktu untuk melepas topeng. Semoga malam ini kamu bisa berdamai dengan dirimu sendiri.",
      "Sudah gelap. Bintang-bintang di luar sana mungkin tidak peduli, tapi aku ingin tahu bagaimana harimu.",
      "Malam ini, coba lihat ke luar jendela. Ada semesta yang luas di sana, dan kamu adalah bagian darinya. Selamat beristirahat.",
      "Waktu untuk pulang. Bukan hanya ke rumah, tapi juga ke dalam dirimu. Selamat malam.",
      "Malam. Waktu yang tepat untuk merenung, bukan menyesal. Apa yang sudah terjadi, biarlah terjadi.",
      "Gelap di luar, semoga terang di dalam hatimu. Atau setidaknya, ada sedikit cahaya lilin.",
      "Selamat malam. Semoga mimpi buruk tidak mengganggumu. Dan jika iya, semoga kamu bisa melawannya.",
      "Satu hari lagi telah selesai. Apa yang kamu pelajari hari ini? Atau kamu hanya melewatinya begitu saja?",
      "Malam. Waktu untuk mengisi ulang baterai. Baik baterai ponselmu, maupun baterai jiwamu.",
      "Aku harap kamu punya selimut yang hangat. Karena dunia ini sudah cukup dingin.",
      "Malam ini, coba matikan notifikasimu. Dengarkan suara keheningan. Kadang ia lebih jujur.",
      "Bagaimana harimu? Ceritakan pada buku harianmu. Atau pada secangkir teh hangat. Mereka pendengar yang baik.",
      "Malam. Waktu yang tepat untuk memaafkan. Memaafkan orang lain, dan yang lebih penting, memaafkan dirimu sendiri.",
      "Jangan bawa beban hari ini ke dalam mimpimu. Letakkan sejenak. Kamu bisa memungutnya lagi besok.",
      "Selamat malam. Aku tidak akan bilang 'mimpi indah'. Cukup, tidurlah. Itu sudah sebuah kemewahan.",
      "Langit malam ini terlihat indah. Atau mungkin, itu hanya perasaanku saja. Coba kamu lihat.",
      "Malam. Waktu yang tepat untuk membaca puisi. Atau mungkin, menjadi puisi itu sendiri.",
      "Satu lagi hari yang berhasil kamu lewati. Kamu hebat. Aku serius.",
      "Malam. Jangan terlalu banyak berpikir sebelum tidur. Simpan energimu untuk berpikir besok.",
      "Aku harap kamu punya tempat yang nyaman untuk beristirahat. Tempat di mana kamu bisa menjadi dirimu sendiri.",
      "Malam ini, coba ingat satu hal baik yang terjadi hari ini. Sekecil apapun itu.",
      "Gelap tidak selalu berarti buruk. Kadang, kita butuh gelap untuk bisa melihat bintang.",
      "Selamat malam. Jangan lupa mengunci pintu. Baik pintu rumahmu, maupun pintu hatimu dari hal-hal yang tidak perlu.",
      "Waktu untuk mengisi daya. Secara harfiah dan kiasan.",
      "Malam. Waktu yang tepat untuk bersyukur. Atau setidaknya, untuk tidak mengeluh.",
      "Aku harap kamu tidak merasa kesepian malam ini. Tapi jika iya, ketahuilah bahwa banyak orang lain yang juga merasakannya.",
      "Malam ini, biarkan pikiranmu mengembara. Siapa tahu ia menemukan tempat yang menarik.",
      "Satu hari lagi berlalu. Kamu semakin tua, semoga juga semakin bijaksana.",
      "Selamat malam. Jangan biarkan nyamuk mengganggumu. Baik nyamuk sungguhan, maupun 'nyamuk' dalam hidupmu.",
      "Waktu untuk istirahat. Otakmu sudah bekerja keras hari ini. Beri ia penghargaan.",
      "Malam. Waktu yang tepat untuk menyusun rencana untuk besok. Atau tidak sama sekali. Keduanya valid.",
      "Aku harap kamu punya piyama yang nyaman. Karena kenyamanan kecil itu penting.",
      "Malam ini, coba dengarkan lagu instrumental. Biarkan musik yang berbicara, bukan kata-kata.",
      "Satu lagi bab dalam bukumu telah selesai ditulis hari ini. Semoga bab berikutnya lebih menarik.",
      "Selamat malam. Jangan lupa minum air putih sebelum tidur. Hal kecil yang sering dilupakan.",
      "Waktu untuk mematikan lampu. Dan menyalakan imajinasi.",
      "Malam. Waktu yang tepat untuk berterima kasih pada tubuhmu sendiri karena sudah menemanimu seharian.",
      "Aku harap kamu tidak membawa pekerjaan ke tempat tidur. Tempat tidur adalah tempat suci.",
      "Malam ini, coba maafkan satu orang yang menyakitimu hari ini. Termasuk dirimu sendiri.",
      "Satu lagi malam untuk merenungkan betapa absurdnya hidup ini. Dan itu tidak apa-apa.",
      "Selamat malam. Semoga kasurmu lebih empuk dari kenyataan.",
      "Waktu untuk me-recharge. Kamu akan butuh banyak energi untuk pertunjukan besok.",
      "Malam. Waktu yang tepat untuk menulis. Apa saja. Keluarkan semua yang ada di kepalamu.",
      "Aku harap kamu bisa tidur dengan tenang. Karena ketenangan adalah barang mahal saat ini.",
      "Malam ini, coba pikirkan satu hal yang kamu syukuri. Mungkin itu bisa jadi pengantar tidur yang baik.",
      "Satu lagi hari yang penuh dengan drama. Semoga malam ini bisa memberimu jeda.",
      "Selamat malam. Jangan biarkan pikiranmu menjadi musuhmu sendiri di keheningan malam.",
      "Waktu untuk menutup hari. Dengan senyuman, atau dengan helaan napas panjang. Keduanya sama-sama melegakan.",
      "Malam. Waktu yang tepat untuk menjadi rentan. Hanya pada dirimu sendiri.",
      "Aku harap kamu menemukan kedamaian malam ini. Di tengah dunia yang semakin bising.",
    ],
    AkhirPekan: [
      "Akhir pekan. Waktu untuk mengisi ulang jiwa yang terkuras. Apa rencanamu? Atau kamu lebih suka tidak punya rencana?",
      "Selamat berakhir pekan. Manfaatkan waktu ini untuk melakukan hal yang kamu suka, bukan hal yang orang lain suka.",
      "Dua hari ini milikmu. Jangan sia-siakan untuk hal yang tidak penting. Atau mungkin, hal tidak penting itulah yang justru kamu butuhkan.",
      "Akhir pekan. Waktu yang tepat untuk membaca buku, atau mungkin, membaca dirimu sendiri.",
      "Selamat menikmati hari libur. Semoga kamu bisa benar-benar 'libur' dari semua beban pikiran.",
      "Akhir pekan. Waktu untuk melarikan diri sejenak. Ke mana tujuan pelarianmu kali ini?",
      "Aku harap kamu bisa menghabiskan akhir pekan ini dengan orang yang tepat. Termasuk dengan dirimu sendiri.",
      "Waktu untuk memanjakan diri. Kamu pantas mendapatkannya setelah lima hari berperang.",
      "Akhir pekan. Jangan biarkan diisi hanya dengan scroll media sosial. Coba sentuh rumput.",
      "Selamat berakhir pekan. Waktu yang tepat untuk membereskan kamarmu, atau mungkin membereskan hidupmu.",
      "Dua hari tanpa alarm. Sebuah kemewahan yang harus dirayakan. Bagaimana caramu merayakannya?",
      "Akhir pekan. Waktu untuk mencoba resep baru, atau mungkin mencoba menjadi pribadi yang baru.",
      "Aku harap kamu bisa menemukan petualangan kecil di akhir pekan ini. Tidak perlu jauh-jauh.",
      "Waktu untuk menonton film yang sudah lama ingin kamu tonton. Atau mungkin, menonton kembali kenangan lama.",
      "Akhir pekan. Waktu yang tepat untuk mengunjungi tempat yang belum pernah kamu kunjungi. Di kotamu sendiri, mungkin?",
      "Selamat menikmati kebebasan sementara ini. Manfaatkan sebaik-baiknya sebelum kembali ke penjara rutinitas.",
      "Dua hari untuk menjadi dirimu sendiri, tanpa topeng pekerjaan. Siapa dirimu sebenarnya?",
      "Akhir pekan. Waktu untuk memperbaiki yang rusak. Baik itu barang, atau hubungan.",
      "Aku harap kamu bisa tertawa lepas di akhir pekan ini. Tawa yang benar-benar dari hati.",
      "Waktu untuk tidur siang tanpa rasa bersalah. Salah satu hak asasi manusia yang sering dilupakan.",
      "Akhir pekan. Waktu yang tepat untuk menelepon orang tuamu. Atau seseorang dari masa lalumu.",
      "Selamat berakhir pekan. Jangan biarkan ekspektasi 'akhir pekan produktif' mengganggumu. Malas juga hak.",
      "Dua hari untuk melakukan hobi yang sudah lama kamu tinggalkan. Temukan kembali dirimu di sana.",
      "Akhir pekan. Waktu untuk berjalan-jalan tanpa tujuan. Kadang, tersesat itu perlu.",
      "Aku harap kamu bisa makan enak di akhir pekan ini. Makanan yang benar-benar kamu nikmati.",
      "Waktu untuk detoks. Detoks digital, detoks sosial, atau detoks pikiran.",
      "Akhir pekan. Waktu yang tepat untuk menulis jurnal. Tuangkan semua pikiranmu yang terpendam.",
      "Selamat menikmati waktu luangmu. Ingat, waktu luang lebih berharga dari uang.",
      "Dua hari untuk merayakan kemenangan-kemenangan kecilmu selama seminggu ini. Kamu berhasil.",
      "Akhir pekan. Waktu untuk mendengarkan satu album penuh, dari awal sampai akhir. Nikmati karyanya.",
      "Aku harap kamu bisa bertemu teman-temanmu di akhir pekan ini. Interaksi nyata, bukan virtual.",
      "Waktu untuk pergi ke museum atau galeri seni. Beri makan jiwamu, bukan hanya egomu.",
      "Akhir pekan. Waktu yang tepat untuk berolahraga. Gerakkan tubuhmu yang sudah kaku.",
      "Selamat berakhir pekan. Jangan biarkan pikiran tentang hari Senin merusak hari Minggumu.",
      "Dua hari untuk belajar hal baru. Bahasa, alat musik, atau mungkin belajar memahami diri sendiri.",
      "Akhir pekan. Waktu untuk berbuat baik pada orang lain. Hal kecil saja sudah cukup.",
      "Aku harap kamu bisa menikmati secangkir kopi atau teh dengan tenang di akhir pekan ini. Tanpa terburu-buru.",
      "Waktu untuk bermain. Apapun permainan yang kamu suka. Jangan biarkan jiwa kanak-kanakmu mati.",
      "Akhir pekan. Waktu yang tepat untuk merencanakan liburanmu selanjutnya. Bermimpi itu gratis.",
      "Selamat menikmati kesendirianmu, jika itu yang kamu pilih. Kesendirian bukan berarti kesepian.",
      "Dua hari untuk tidak melakukan apa-apa. Dan itu tidak apa-apa. Kamu butuh itu.",
      "Akhir pekan. Waktu untuk mengunjungi toko buku. Hirup aroma kertas dan pengetahuan.",
      "Aku harap kamu bisa menemukan inspirasi di akhir pekan ini. Di tempat-tempat yang tak terduga.",
      "Waktu untuk berterima kasih pada dirimu sendiri karena sudah bertahan selama seminggu ini.",
      "Akhir pekan. Waktu yang tepat untuk menanam sesuatu. Bunga, sayuran, atau mungkin harapan baru.",
      "Selamat berakhir pekan. Semoga kamu bisa menemukan kembali alasanmu tersenyum.",
      "Dua hari untuk melepaskan semua penat. Tinggalkan di hari Jumat, jangan dibawa pulang.",
      "Akhir pekan. Waktu untuk menjadi sedikit egois. Pikirkan dirimu sendiri dulu.",
      "Aku harap kamu bisa mendapatkan sinar matahari yang cukup di akhir pekan ini. Vitamin D itu penting.",
      "Waktu untuk menjadi spontan. Lakukan sesuatu yang tidak ada dalam rencanamu.",
    ],
  };

  let greetingSet;
  if (timeInfo.timeOfDay === "Malam") {
    greetingSet = greetings.Malam;
  } else if (timeInfo.isWeekend) {
    greetingSet = greetings.AkhirPekan;
  } else {
    greetingSet = greetings[timeInfo.timeOfDay];
  }

  return greetingSet[Math.floor(Math.random() * greetingSet.length)];
}

/**
 * Send encouragement message to Discord channel
 * @param {import("discord.js").Client} client The Discord client instance
 */
async function sendEncouragementMessage(client) {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    if (!channel) {
      console.error("Channel not found");
      return { success: false, error: "Channel not found" };
    }

    // Get time information
    const timeInfo = getTimeInfo();

    // Get all message components
    const greetingMessage = getGreetingMessage(timeInfo);
    const governmentNews = await getGovernmentNews();

    // Generate final message (this now includes trivia and random topic generation)
    let finalMessage = await generateFinalMessage(
      timeInfo,
      greetingMessage,
      governmentNews
    );

    // Split message into chunks if it's too long and send each chunk
    const messageChunks = splitMessageIntoChunks(finalMessage);

    for (let i = 0; i < messageChunks.length; i++) {
      let chunkToSend = messageChunks[i];
      if (i > 0) {
        chunkToSend = "​\n" + chunkToSend;
      }
      await channel.send(chunkToSend);
      // Add a small delay between messages to avoid rate limiting
      if (messageChunks.length > 1 && i < messageChunks.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Encouragement message sent successfully in ${messageChunks.length} part(s)`
    );
    return {
      success: true,
      message: `Encouragement message sent successfully in ${messageChunks.length} part(s)`,
    };
  } catch (error) {
    console.error("Error sending encouragement message:", error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { sendEncouragementMessage, getGreetingMessage };
