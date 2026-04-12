export interface BambaraLesson {
  id: string
  titleRu: string
  titleFr: string
  emoji: string
  words: BambaraWord[]
}

export interface BambaraWord {
  bambara: string
  french: string
  russian: string
  pronunciation: string
  audioText: string
  example?: string
  exampleRu?: string
}

export const bambaraLessons: BambaraLesson[] = [
  {
    id: 'greetings',
    titleRu: 'Приветствия',
    titleFr: 'Salutations',
    emoji: '👋',
    words: [
      { bambara: 'I ni ce', french: 'Bonjour', russian: 'Здравствуйте', pronunciation: 'iː ni tʃe', audioText: 'I ni tché', example: 'I ni ce, i kana wa?', exampleRu: 'Bonjour, comment allez-vous?' },
      { bambara: 'I ni tile', french: 'Bon après-midi', russian: 'Добрый день', pronunciation: 'iː ni tile', audioText: 'I ni tilé', example: 'I ni tile, i kɛnɛ wa?', exampleRu: 'Bon après-midi, comment ça va?' },
      { bambara: 'I ni su', french: 'Bonsoir', russian: 'Добрый вечер', pronunciation: 'iː ni su', audioText: 'I ni sou', example: 'I ni su, i ka kɛnɛ kɔ?', exampleRu: 'Bonsoir, comment allez-vous?' },
      { bambara: 'I kɛnɛ wa?', french: 'Comment vas-tu?', russian: 'Как дела?', pronunciation: 'i kɛnɛ wa', audioText: 'I kéné oua?', example: 'I kɛnɛ wa? - N kɛnɛ, i ni ce.', exampleRu: 'Comment vas-tu? - Ça va, merci.' },
      { bambara: 'N kɛnɛ', french: 'Je vais bien', russian: 'У меня всё хорошо', pronunciation: 'n kɛnɛ', audioText: 'N kéné', example: 'N kɛnɛ, a ni ce.', exampleRu: 'Je vais bien, merci.' },
      { bambara: 'A ni ce', french: 'Merci', russian: 'Спасибо', pronunciation: 'a ni tʃe', audioText: 'A ni tché', example: 'A ni ce bɛɛ.', exampleRu: 'Merci beaucoup.' },
      { bambara: 'N ba', french: 'De rien', russian: 'Пожалуйста', pronunciation: 'n ba', audioText: 'N ba', example: 'N ba, i kana.', exampleRu: 'De rien, je t\'en prie.' },
      { bambara: 'I ni ce i ni kene', french: 'Au revoir', russian: 'До свидания', pronunciation: 'i ni tʃe i ni kene', audioText: 'I ni tché i ni kéné', example: 'I ni ce i ni kene, k\'i ce kelen.', exampleRu: 'Au revoir, à demain.' },
      { bambara: 'I tɔgɔ?', french: 'Comment t\'appelles-tu?', russian: 'Как тебя зовут?', pronunciation: 'i tɔgɔ', audioText: 'I togô?', example: 'I tɔgɔ? - N tɔgɔ Moussa ye.', exampleRu: 'Comment t\'appelles-tu? - Je m\'appelle Moussa.' },
      { bambara: 'N tɔgɔ ... ye', french: 'Je m\'appelle...', russian: 'Меня зовут...', pronunciation: 'n tɔgɔ ... ye', audioText: 'N togô ... ié', example: 'N tɔgɔ Moussa ye.', exampleRu: 'Je m\'appelle Moussa.' },
    ]
  },
  {
    id: 'numbers',
    titleRu: 'Числа',
    titleFr: 'Nombres',
    emoji: '🔢',
    words: [
      { bambara: 'Kelen', french: 'Un (1)', russian: 'Один', pronunciation: 'kelen', audioText: 'Kélèn', example: 'Kelen ye', exampleRu: 'C\'est un' },
      { bambara: 'Fila', french: 'Deux (2)', russian: 'Два', pronunciation: 'fila', audioText: 'Fila', example: 'Fila ye', exampleRu: 'C\'est deux' },
      { bambara: 'Saba', french: 'Trois (3)', russian: 'Три', pronunciation: 'saba', audioText: 'Saba', example: 'Saba ye', exampleRu: 'C\'est trois' },
      { bambara: 'Nani', french: 'Quatre (4)', russian: 'Четыре', pronunciation: 'nani', audioText: 'Nani', example: 'Nani ye', exampleRu: 'C\'est quatre' },
      { bambara: 'Duru', french: 'Cinq (5)', russian: 'Пять', pronunciation: 'duru', audioText: 'Dourou', example: 'Duru ye', exampleRu: 'C\'est cinq' },
      { bambara: 'Woro', french: 'Six (6)', russian: 'Шесть', pronunciation: 'wɔrɔ', audioText: 'Worô', example: 'Woro ye', exampleRu: 'C\'est six' },
      { bambara: 'Wolonfila', french: 'Sept (7)', russian: 'Семь', pronunciation: 'wolonfila', audioText: 'Wolonfila', example: 'Wolonfila ye', exampleRu: 'C\'est sept' },
      { bambara: 'Segin', french: 'Huit (8)', russian: 'Восемь', pronunciation: 'segin', audioText: 'Séguin', example: 'Segin ye', exampleRu: 'C\'est huit' },
      { bambara: 'Kononton', french: 'Neuf (9)', russian: 'Девять', pronunciation: 'kɔnɔntɔn', audioText: 'Kononton', example: 'Kononton ye', exampleRu: 'C\'est neuf' },
      { bambara: 'Tan', french: 'Dix (10)', russian: 'Десять', pronunciation: 'tan', audioText: 'Tan', example: 'Tan ye', exampleRu: 'C\'est dix' },
      { bambara: 'Bilen', french: 'Vingt (20)', russian: 'Двадцать', pronunciation: 'bilen', audioText: 'Bilèn', example: 'Bilen ye', exampleRu: 'C\'est vingt' },
      { bambara: 'Keme', french: 'Cent (100)', russian: 'Сто', pronunciation: 'kɛmɛ', audioText: 'Kémé', example: 'Keme ye', exampleRu: 'C\'est cent' },
    ]
  },
  {
    id: 'market',
    titleRu: 'Рынок и покупки',
    titleFr: 'Marché et achats',
    emoji: '🛒',
    words: [
      { bambara: 'Jagajagalen ye mun ye?', french: 'Combien ça coûte?', russian: 'Сколько это стоит?', pronunciation: 'dʒagadʒagalen ye mun ye', audioText: 'Djagadjalèn ié moun ié?', example: 'Jagajagalen ye mun ye? - Keme CFA.', exampleRu: 'Combien ça coûte? - Cent CFA.' },
      { bambara: 'Ne b\'a fe', french: 'Je veux ceci', russian: 'Я хочу это', pronunciation: 'ne ba fe', audioText: 'Né ba fè', example: 'Ne b\'a fe, a ye.', exampleRu: 'Je veux ceci, s\'il vous plaît.' },
      { bambara: 'A ye balen', french: 'C\'est cher', russian: 'Это дорого', pronunciation: 'a ye balen', audioText: 'A ié balèn', example: 'A ye balen bɛɛ!', exampleRu: 'C\'est très cher!' },
      { bambara: 'A ye ntɔn', french: 'C\'est bon marché', russian: 'Это дёшево', pronunciation: 'a ye ntɔn', audioText: 'A ié nton', example: 'A ye ntɔn, n ba.', exampleRu: 'C\'est pas cher, merci.' },
      { bambara: 'Jagajalen kɛ', french: 'Réduire le prix', russian: 'Сделай дешевле', pronunciation: 'dʒagadʒalen kɛ', audioText: 'Djagadjalèn ké', example: 'Jagajalen kɛ, i ni ce.', exampleRu: 'Réduisez le prix, s\'il vous plaît.' },
      { bambara: 'Ne b\'a san', french: 'Je prends', russian: 'Я беру', pronunciation: 'ne ba san', audioText: 'Né ba san', example: 'Ne b\'a san, a ni ce.', exampleRu: 'Je le prends, merci.' },
      { bambara: 'Jagajalen', french: 'Marché', russian: 'Рынок', pronunciation: 'dʒagadʒalen', audioText: 'Djagadjalèn', example: 'N ta jagajalen la.', exampleRu: 'Je vais au marché.' },
      { bambara: 'Sefa', french: 'Argent', russian: 'Деньги', pronunciation: 'sefa', audioText: 'Séfa', example: 'Sefa kura.', exampleRu: 'De l\'argent.' },
      { bambara: 'Nta', french: 'Acheter', russian: 'Купить', pronunciation: 'nta', audioText: 'Nta', example: 'Ne b\'a nta.', exampleRu: 'Je veux acheter.' },
      { bambara: 'Kɔnɔ', french: 'Donner', russian: 'Дать', pronunciation: 'kɔnɔ', audioText: 'Konô', example: 'Kɔnɔ n ye.', exampleRu: 'Donne-moi.' },
    ]
  },
  {
    id: 'food',
    titleRu: 'Еда и напитки',
    titleFr: 'Nourriture et boissons',
    emoji: '🍽️',
    words: [
      { bambara: 'Ji', french: 'Eau', russian: 'Вода', pronunciation: 'dʒi', audioText: 'Dji', example: 'Kɔnɔ ji n ye.', exampleRu: 'Donne-moi de l\'eau.' },
      { bambara: 'Ataya', french: 'Thé', russian: 'Чай', pronunciation: 'ataya', audioText: 'Ataya', example: 'Ne b\'a ataya.', exampleRu: 'Je veux du thé.' },
      { bambara: 'Duga', french: 'Riz', russian: 'Рис', pronunciation: 'duga', audioText: 'Douga', example: 'Duga ye mun ye?', exampleRu: 'Qu\'est-ce que le riz?' },
      { bambara: 'To', french: 'Couscous de mil', russian: 'Кускус из проса', pronunciation: 'tɔ', audioText: 'Tô', example: 'To ni tiga.', exampleRu: 'Couscous et sauce d\'arachide.' },
      { bambara: 'Riz jiga', french: 'Riz au gras', russian: 'Рис с мясом', pronunciation: 'riz dʒiga', audioText: 'Riz djiga', example: 'Riz jiga ye ladji.', exampleRu: 'Le riz au gras est délicieux.' },
      { bambara: 'Nama', french: 'Viande', russian: 'Мясо', pronunciation: 'nama', audioText: 'Nama', example: 'Nama ye mun ye?', exampleRu: 'Qu\'est-ce que la viande?' },
      { bambara: 'Ginɛ', french: 'Poisson', russian: 'Рыба', pronunciation: 'ginɛ', audioText: 'Guiné', example: 'Ginɛ ye ladji.', exampleRu: 'Le poisson est bon.' },
      { bambara: 'Kɔnɔ', french: 'Piment', russian: 'Перец', pronunciation: 'kɔnɔ', audioText: 'Konô', example: 'Kɔnɔ bɛ balen!', exampleRu: 'Le piment est fort!' },
      { bambara: 'Duman', french: 'Sel', russian: 'Соль', pronunciation: 'duman', audioText: 'Douman', example: 'Duman bɛ kɛ.', exampleRu: 'Il faut du sel.' },
      { bambara: 'Ji kɔrɔ', french: 'Eau fraîche', russian: 'Холодная вода', pronunciation: 'dʒi kɔrɔ', audioText: 'Dji korô', example: 'Ji kɔrɔ bɛ fe.', exampleRu: 'Je veux de l\'eau fraîche.' },
    ]
  },
  {
    id: 'directions',
    titleRu: 'Направления',
    titleFr: 'Directions',
    emoji: '📍',
    words: [
      { bambara: 'I be ta?', french: 'Où vas-tu?', russian: 'Куда ты идёшь?', pronunciation: 'i be ta', audioText: 'I bé ta?', example: 'I be ta? - Ne be Bamako la.', exampleRu: 'Où vas-tu? - Je vais à Bamako.' },
      { bambara: '... bɛ yan', french: '... est ici', russian: '... здесь', pronunciation: '... bɛ jan', audioText: '... bé yan', example: 'Jagajalen bɛ yan.', exampleRu: 'Le marché est ici.' },
      { bambara: '... bɛ yan kɔ', french: '... est là-bas', russian: '... там', pronunciation: '... bɛ jan kɔ', audioText: '... bé yan kô', example: 'So bɛ yan kɔ.', exampleRu: 'La voiture est là-bas.' },
      { bambara: 'Ta jugu', french: 'Tourne à gauche', russian: 'Поверни налево', pronunciation: 'ta dʒugu', audioText: 'Ta dougou', example: 'Ta jugu yan.', exampleRu: 'Tourne à gauche ici.' },
      { bambara: 'Ta kɔnɔ', french: 'Tourne à droite', russian: 'Поверни направо', pronunciation: 'ta kɔnɔ', audioText: 'Ta konô', example: 'Ta kɔnɔ yan.', exampleRu: 'Tourne à droite ici.' },
      { bambara: 'Ta jugu kelen', french: 'Continue tout droit', russian: 'Иди прямо', pronunciation: 'ta dʒugu kelen', audioText: 'Ta dougou kélèn', example: 'Ta jugu kelen kelen.', exampleRu: 'Continue tout droit.' },
      { bambara: 'Yan', french: 'Ici', russian: 'Здесь', pronunciation: 'jan', audioText: 'Yan', example: 'Yan wa.', exampleRu: 'C\'est ici.' },
      { bambara: 'Yan kɔ', french: 'Là-bas', russian: 'Там', pronunciation: 'jan kɔ', audioText: 'Yan kô', example: 'Yan kɔ wa.', exampleRu: 'C\'est là-bas.' },
      { bambara: 'Yɔrɔ', french: 'Endroit / Lieu', russian: 'Место', pronunciation: 'jɔrɔ', audioText: 'Yorô', example: 'Yɔrɔ min?', exampleRu: 'Quel endroit?' },
      { bambara: 'Bamakola', french: 'À Bamako', russian: 'В Бамако', pronunciation: 'bamakola', audioText: 'Bamakola', example: 'Ne be Bamakola.', exampleRu: 'Je suis à Bamako.' },
    ]
  },
  {
    id: 'essential',
    titleRu: 'Основные фразы',
    titleFr: 'Phrases essentielles',
    emoji: '💬',
    words: [
      { bambara: 'Aw', french: 'Oui', russian: 'Да', pronunciation: 'aw', audioText: 'Aou', example: 'Aw, n kɛnɛ.', exampleRu: 'Oui, je vais bien.' },
      { bambara: 'Ayi', french: 'Non', russian: 'Нет', pronunciation: 'aji', audioText: 'Ayi', example: 'Ayi, n be fe.', exampleRu: 'Non, je ne veux pas.' },
      { bambara: 'N ma faamu', french: 'Je ne comprends pas', russian: 'Я не понимаю', pronunciation: 'n ma faamu', audioText: 'N ma faamou', example: 'N ma faamu, i ka bamanankan wa?', exampleRu: 'Je ne comprends pas, tu parles bambara?' },
      { bambara: 'I bamanankan ma wa?', french: 'Tu parles bambara?', russian: 'Ты говоришь на бамбара?', pronunciation: 'i bamanankan ma wa', audioText: 'I bamanankan ma oua?', example: 'I bamanankan ma wa? - Aw, n ma.', exampleRu: 'Tu parles bambara? - Oui, je parle.' },
      { bambara: 'N ye muso ye', french: 'Je suis une femme', russian: 'Я женщина', pronunciation: 'n ye muso ye', audioText: 'N ié mouso ié', example: 'N ye muso ye, i ni ce.', exampleRu: 'Je suis une femme, bonjour.' },
      { bambara: 'N ye ce ye', french: 'Je suis un homme', russian: 'Я мужчина', pronunciation: 'n ye tʃe ye', audioText: 'N ié tché ié', example: 'N ye ce ye, i ni ce.', exampleRu: 'Je suis un homme, bonjour.' },
      { bambara: 'A ni ce', french: 'Excuse-moi', russian: 'Извините', pronunciation: 'a ni tʃe', audioText: 'A ni tché', example: 'A ni ce, yɔrɔ min?', exampleRu: 'Excusez-moi, où est...?' },
      { bambara: 'Eh! a ni ce!', french: 'Attention!', russian: 'Внимание!', pronunciation: 'e a ni tʃe', audioText: 'Eh! A ni tché!', example: 'Eh! a ni ce, so bɛ na!', exampleRu: 'Attention, la voiture arrive!' },
      { bambara: 'I ni ce Mali mogo', french: 'Bonjour cher Malien', russian: 'Здравствуйте, дорогой малиец', pronunciation: 'i ni tʃe mali mogo', audioText: 'I ni tché Mali mogo', example: 'I ni ce Mali mogo, i kɛnɛ wa?', exampleRu: 'Bonjour cher Malien, comment allez-vous?' },
      { bambara: 'Ala k\'a ni ce', french: 'Que Dieu vous bénisse', russian: 'Да благословит вас Бог', pronunciation: 'ala ka ni tʃe', audioText: 'Ala ka ni tché', example: 'Ala k\'a ni ce bɛɛ.', exampleRu: 'Que Dieu vous bénisse tous.' },
    ]
  },
]

export const bambaraQuizzes = [
  { question: 'Que veut dire "I ni ce"?', questionRu: 'Что значит "I ni ce"?', options: ['Bonjour', 'Merci', 'Au revoir', 'Oui'], correct: 0 },
  { question: 'Comment dit-on "Merci" en bambara?', questionRu: 'Как сказать "Спасибо" на бамбара?', options: ['I ni ce', 'A ni ce', 'N kɛnɛ', 'Aw'], correct: 1 },
  { question: 'Que veut dire "Ayi"?', questionRu: 'Что значит "Ayi"?', options: ['Oui', 'Non', 'Bonjour', 'Merci'], correct: 1 },
  { question: 'Comment dit-on "eau" en bambara?', questionRu: 'Как сказать "вода" на бамбара?', options: ['Ji', 'Nama', 'Duga', 'Ataya'], correct: 0 },
  { question: 'Que veut dire "I be ta?"', questionRu: 'Что значит "I be ta?"', options: ['Où vas-tu?', 'Comment vas-tu?', 'Tu veux?', 'Qu\'est-ce que c\'est?'], correct: 0 },
  { question: 'Comment dit-on "Non" en bambara?', questionRu: 'Как сказать "Нет" на бамбара?', options: ['Aw', 'Ayi', 'A ni ce', 'N ba'], correct: 1 },
  { question: 'Que veut dire "N tɔgɔ Moussa ye"?', questionRu: 'Что значит "N tɔgɔ Moussa ye"?', options: ['Je m\'appelle Moussa', 'Moussa est là', 'Moussa va bien', 'Bonjour Moussa'], correct: 0 },
  { question: 'Comment dit-on "c\'est cher" en bambara?', questionRu: 'Как сказать "это дорого" на бамбара?', options: ['A ye ntɔn', 'A ye balen', 'N kɛnɛ', 'Jagajalen'], correct: 1 },
]
