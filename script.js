"use strict";

const BASE_QUESTIONS = [

{ id:1, category:"Conscience", level:1, xp:10, question:"Sommes-nous vraiment maîtres de nos pensées ou sommes-nous simplement témoins de ce qui apparaît dans notre esprit ?", paradox:"Si nous observons nos pensées, qui est réellement celui qui observe ?" },
{ id:2, category:"Liberté", level:1, xp:10, question:"Une personne peut-elle être libre si ses choix sont influencés par son éducation, sa société et son passé ?", paradox:"La liberté existe-t-elle si toutes nos décisions ont une cause ?" },
{ id:3, category:"Identité", level:2, xp:15, question:"Si tous nos souvenirs disparaissaient, resterions-nous la même personne ?", paradox:"Notre identité dépend-elle de notre mémoire ou de quelque chose de plus profond ?" },
{ id:4, category:"Vérité", level:2, xp:15, question:"Une vérité qui détruit quelqu'un vaut-elle mieux qu'un mensonge qui le protège ?", paradox:"La vérité est-elle toujours moralement supérieure ?" },
{ id:5, category:"Éthique", level:2, xp:15, question:"Peut-on faire une mauvaise action pour obtenir une bonne conséquence ?", paradox:"La fin peut-elle réellement justifier les moyens ?" },
{ id:6, category:"Temps", level:1, xp:10, question:"Vivons-nous réellement dans le présent ou seulement dans le souvenir du passé et l'attente du futur ?", paradox:"Le présent existe-t-il vraiment s'il disparaît immédiatement ?" },
{ id:7, category:"Mort", level:3, xp:20, question:"La conscience de notre mort donne-t-elle un sens à notre existence ?", paradox:"Sans la mort, la vie aurait-elle la même valeur ?" },
{ id:8, category:"Amour", level:2, xp:15, question:"Aimons-nous une personne pour ce qu'elle est réellement ou pour l'image que nous construisons d'elle ?", paradox:"Pouvons-nous connaître totalement quelqu'un ?" },
{ id:9, category:"Société", level:2, xp:15, question:"Sommes-nous nous-mêmes ou seulement le produit des attentes de la société ?", paradox:"Peut-on être authentique dans un monde qui nous influence constamment ?" },
{ id:10, category:"Pouvoir", level:3, xp:20, question:"Le pouvoir révèle-t-il la vraie nature d'une personne ou la transforme-t-il ?", paradox:"Possédons-nous le pouvoir ou est-ce le pouvoir qui nous possède ?" },

{ id:11, category:"Conscience", level:2, xp:15, question:"Peut-on penser sans mots, ou le langage est-il la structure même de la pensée ?", paradox:"Une pensée qu'on ne peut pas formuler existe-t-elle vraiment ?" },
{ id:12, category:"Conscience", level:3, xp:20, question:"Si une machine affirmait ressentir, aurions-nous le droit de ne pas la croire ?", paradox:"Comment prouver une conscience autre que par la nôtre ?" },
{ id:13, category:"Conscience", level:1, xp:10, question:"Rêvons-nous pour fuir la réalité ou pour mieux la comprendre ?", paradox:"Le rêve est-il moins réel que ce qu'il révèle de nous ?" },
{ id:14, category:"Conscience", level:4, xp:25, question:"Y a-t-il un 'moi' stable, ou seulement une succession d'états mentaux que nous appelons ainsi par commodité ?", paradox:"Qui serait celui qui remarque que le moi change ?" },

{ id:15, category:"Liberté", level:2, xp:15, question:"Choisir de ne pas choisir est-il encore un choix ?", paradox:"Peut-on échapper à la liberté en refusant de l'exercer ?" },
{ id:16, category:"Liberté", level:3, xp:20, question:"Sommes-nous plus libres avec plus d'options, ou l'abondance de choix devient-elle une nouvelle contrainte ?", paradox:"La liberté illimitée peut-elle devenir paralysante ?" },
{ id:17, category:"Liberté", level:4, xp:25, question:"Peut-on être libre à l'intérieur d'une prison si l'esprit refuse de s'y soumettre ?", paradox:"La liberté est-elle une condition extérieure ou un état intérieur ?" },
{ id:18, category:"Liberté", level:1, xp:10, question:"Obéir à une règle qu'on a soi-même choisie est-ce encore de la liberté ou déjà de la contrainte ?", paradox:"Peut-on se lier librement à une obligation ?" },

{ id:19, category:"Identité", level:1, xp:10, question:"Sommes-nous la même personne que nous étions il y a dix ans ?", paradox:"À partir de quel changement cesse-t-on d'être soi-même ?" },
{ id:20, category:"Identité", level:3, xp:20, question:"Notre identité est-elle ce que nous pensons être ou ce que les autres perçoivent de nous ?", paradox:"Peut-on se connaître sans le regard d'autrui ?" },
{ id:21, category:"Identité", level:2, xp:15, question:"Portons-nous plusieurs masques au point de ne plus savoir lequel est notre vrai visage ?", paradox:"Existe-t-il un visage sans masque ?" },
{ id:22, category:"Identité", level:4, xp:25, question:"Si l'on pouvait copier parfaitement notre esprit dans une autre machine, la copie serait-elle nous ?", paradox:"L'identité tient-elle à la continuité ou à l'information ?" },

{ id:23, category:"Vérité", level:1, xp:10, question:"Préférons-nous vraiment la vérité, ou surtout qu'on nous confirme ce que nous croyons déjà ?", paradox:"Cherche-t-on la vérité ou une confirmation ?" },
{ id:24, category:"Vérité", level:3, xp:20, question:"Existe-t-il une vérité objective, ou seulement des perspectives que nous prenons pour des vérités ?", paradox:"Peut-on sortir de son propre point de vue pour juger ce qui est vrai ?" },
{ id:25, category:"Vérité", level:2, xp:15, question:"Vaut-il mieux vivre heureux dans l'illusion ou lucide dans la douleur ?", paradox:"Le bonheur perd-il sa valeur s'il repose sur un mensonge ?" },
{ id:26, category:"Vérité", level:4, xp:25, question:"Une vérité scientifique reste-t-elle vraie si plus personne n'existe pour la penser ?", paradox:"La vérité dépend-elle d'un esprit qui la conçoit ?" },

{ id:27, category:"Éthique", level:1, xp:10, question:"Faire le bien par intérêt personnel est-ce encore de la vertu ?", paradox:"La morale peut-elle exister sans aucun bénéfice pour soi ?" },
{ id:28, category:"Éthique", level:3, xp:20, question:"Sommes-nous responsables des conséquences que nous n'avons pas pu prévoir ?", paradox:"Peut-on être coupable d'un mal qu'on ignorait causer ?" },
{ id:29, category:"Éthique", level:2, xp:15, question:"Faut-il toujours dire la vérité, même quand elle ne sert à rien de bon ?", paradox:"Le silence peut-il être un mensonge par omission ?" },
{ id:30, category:"Éthique", level:5, xp:30, question:"Peut-on juger moralement une époque avec les valeurs d'une autre ?", paradox:"La morale est-elle universelle ou façonnée par son temps ?" },

{ id:31, category:"Temps", level:2, xp:15, question:"Le temps existe-t-il indépendamment de notre conscience qui le mesure ?", paradox:"Sans esprit pour le percevoir, y aurait-il encore un 'avant' et un 'après' ?" },
{ id:32, category:"Temps", level:1, xp:10, question:"Regrettons-nous le passé parce qu'il était meilleur, ou parce qu'il n'est plus modifiable ?", paradox:"La nostalgie idéalise-t-elle ce qui a disparu ?" },
{ id:33, category:"Temps", level:3, xp:20, question:"Si l'on pouvait revivre sa vie à l'identique indéfiniment, cela changerait-il la valeur de chaque instant ?", paradox:"L'éternel retour rend-il chaque geste plus lourd ou plus vain ?" },
{ id:34, category:"Temps", level:4, xp:25, question:"Sommes-nous les mêmes personnes d'un instant à l'autre, ou renaissons-nous à chaque seconde ?", paradox:"Qu'est-ce qui relie le moi d'hier au moi de maintenant ?" },

{ id:35, category:"Mort", level:2, xp:15, question:"Craignons-nous la mort elle-même, ou l'idée de ne plus exister pour ceux que nous aimons ?", paradox:"Peut-on avoir peur d'un état que l'on ne pourra jamais ressentir ?" },
{ id:36, category:"Mort", level:1, xp:10, question:"Une vie plus courte mais intense vaut-elle mieux qu'une vie longue mais monotone ?", paradox:"La quantité de vie compte-t-elle plus que son intensité ?" },
{ id:37, category:"Mort", level:4, xp:25, question:"Si l'on pouvait vivre éternellement, le désir garderait-il son sens ?", paradox:"L'immortalité tuerait-elle le désir en supprimant l'urgence ?" },
{ id:38, category:"Mort", level:3, xp:20, question:"Peut-on réellement se préparer à sa propre mort, ou n'est-ce qu'une illusion de contrôle ?", paradox:"La mort peut-elle être anticipée par une expérience qu'on n'a jamais vécue ?" },

{ id:39, category:"Amour", level:1, xp:10, question:"Aime-t-on quelqu'un, ou aime-t-on ce que cette personne nous fait ressentir ?", paradox:"L'amour est-il tourné vers l'autre ou vers soi ?" },
{ id:40, category:"Amour", level:3, xp:20, question:"Peut-on aimer sincèrement sans jamais vouloir posséder l'autre ?", paradox:"L'amour peut-il exister sans un besoin de contrôle ?" },
{ id:41, category:"Amour", level:2, xp:15, question:"La jalousie est-elle une preuve d'amour ou la preuve d'une insécurité ?", paradox:"Peut-on aimer sans jamais craindre de perdre ?" },
{ id:42, category:"Amour", level:4, xp:25, question:"Aimerions-nous encore quelqu'un si cette personne ne changeait jamais, ne grandissait jamais ?", paradox:"L'amour se nourrit-il de la découverte de l'autre ou de sa stabilité ?" },

{ id:43, category:"Société", level:1, xp:10, question:"Les lois nous protègent-elles ou nous empêchent-elles surtout d'être pleinement nous-mêmes ?", paradox:"La sécurité collective peut-elle coexister avec la liberté individuelle totale ?" },
{ id:44, category:"Société", level:3, xp:20, question:"Une société peut-elle être juste si elle repose sur la compétition entre ses membres ?", paradox:"La justice sociale et la compétition sont-elles compatibles ?" },
{ id:45, category:"Société", level:2, xp:15, question:"Sommes-nous solidaires par nature, ou seulement quand notre propre intérêt est en jeu ?", paradox:"L'altruisme existe-t-il indépendamment de tout bénéfice caché ?" },
{ id:46, category:"Société", level:4, xp:25, question:"Une civilisation avancée technologiquement est-elle nécessairement plus morale ?", paradox:"Le progrès technique entraîne-t-il un progrès éthique ?" },

{ id:47, category:"Pouvoir", level:1, xp:10, question:"Cherche-t-on le pouvoir pour ce qu'il permet de faire, ou pour ce qu'il permet de ne plus subir ?", paradox:"Le désir de pouvoir naît-il d'une force ou d'une peur ?" },
{ id:48, category:"Pouvoir", level:4, xp:25, question:"Peut-on diriger les autres sans jamais les instrumentaliser, même un peu ?", paradox:"Le leadership est-il compatible avec un respect total de l'autre ?" },
{ id:49, category:"Pouvoir", level:2, xp:15, question:"Obéit-on à l'autorité par conviction ou par peur des conséquences ?", paradox:"L'obéissance volontaire existe-t-elle vraiment ?" },
{ id:50, category:"Pouvoir", level:3, xp:20, question:"Le pouvoir absolu peut-il rester incorruptible s'il n'a jamais de contre-pouvoir ?", paradox:"La vertu résiste-t-elle à l'absence totale de limites ?" },

{ id:51, category:"Bonheur", level:1, xp:10, question:"Le bonheur est-il un but à atteindre ou un effet secondaire d'une vie bien vécue ?", paradox:"Peut-on rechercher activement le bonheur sans qu'il s'échappe ?" },
{ id:52, category:"Bonheur", level:2, xp:15, question:"Sommes-nous heureux par comparaison, ou existe-t-il un bonheur absolu indépendant des autres ?", paradox:"Le bonheur peut-il exister sans un point de référence pour le mesurer ?" },
{ id:53, category:"Bonheur", level:3, xp:20, question:"Une vie sans souffrance produirait-elle encore un sentiment de joie ?", paradox:"Le bonheur a-t-il besoin du malheur pour être perçu ?" },
{ id:54, category:"Bonheur", level:4, xp:25, question:"Peut-on être heureux tout en sachant que ce bonheur est temporaire ?", paradox:"La conscience de l'impermanence détruit-elle la joie du moment présent ?" },

{ id:55, category:"Solitude", level:1, xp:10, question:"La solitude choisie est-elle la même chose que l'isolement subi ?", paradox:"Le même état extérieur peut-il produire deux expériences opposées ?" },
{ id:56, category:"Solitude", level:2, xp:15, question:"Avons-nous besoin des autres pour exister, ou seulement pour nous rassurer d'exister ?", paradox:"L'existence a-t-elle besoin d'un témoin pour être réelle ?" },
{ id:57, category:"Solitude", level:3, xp:20, question:"Peut-on se sentir seul entouré de monde, et accompagné dans une solitude totale ?", paradox:"La solitude est-elle une question de présence ou de perception ?" },
{ id:58, category:"Solitude", level:4, xp:25, question:"Sommes-nous fondamentalement seuls, chaque conscience étant enfermée en elle-même ?", paradox:"Peut-on jamais vraiment partager une expérience intérieure ?" },

{ id:59, category:"Peur", level:1, xp:10, question:"La peur nous protège-t-elle vraiment, ou nous empêche-t-elle surtout de vivre pleinement ?", paradox:"Peut-on distinguer une peur utile d'une peur qui limite sans raison ?" },
{ id:60, category:"Peur", level:2, xp:15, question:"Craint-on davantage l'échec, ou le jugement des autres face à cet échec ?", paradox:"La peur de l'échec est-elle une peur sociale déguisée ?" },
{ id:61, category:"Peur", level:3, xp:20, question:"Le courage est-il l'absence de peur, ou la capacité d'agir malgré elle ?", paradox:"Un être sans peur peut-il vraiment être courageux ?" },
{ id:62, category:"Peur", level:4, xp:25, question:"La peur de la mort façonne-t-elle secrètement toutes nos autres décisions ?", paradox:"Peut-on agir librement si une peur fondamentale oriente tout ?" },

{ id:63, category:"Désir", level:1, xp:10, question:"Désirons-nous les choses parce qu'elles ont de la valeur, ou leur donnons-nous de la valeur parce que nous les désirons ?", paradox:"La valeur précède-t-elle le désir, ou le désir crée-t-il la valeur ?" },
{ id:64, category:"Désir", level:2, xp:15, question:"Le désir s'éteint-il une fois satisfait, ou se déplace-t-il simplement vers un nouvel objet ?", paradox:"Existe-t-il un désir qui puisse être définitivement comblé ?" },
{ id:65, category:"Désir", level:3, xp:20, question:"Voulons-nous vraiment obtenir ce que nous désirons, ou préférons-nous continuer à le désirer ?", paradox:"L'attente peut-elle être plus précieuse que l'accomplissement ?" },
{ id:66, category:"Désir", level:4, xp:25, question:"Nos désirs sont-ils vraiment les nôtres, ou nous sont-ils soufflés par ce que nous voyons chez les autres ?", paradox:"Peut-on désirer sans avoir été influencé par le désir d'autrui ?" },

{ id:67, category:"Rêve", level:1, xp:10, question:"Poursuivre un rêve inaccessible a-t-il plus de valeur que d'atteindre un objectif modeste ?", paradox:"La grandeur d'un but justifie-t-elle l'échec probable ?" },
{ id:68, category:"Rêve", level:2, xp:15, question:"Nos rêves d'enfant nous définissent-ils encore, ou étaient-ils déjà les rêves de quelqu'un d'autre ?", paradox:"Un rêve d'enfant est-il vraiment personnel ou déjà transmis ?" },
{ id:69, category:"Rêve", level:3, xp:20, question:"Faut-il parfois renoncer à un rêve pour devenir soi-même ?", paradox:"Rester fidèle à un rêve peut-il devenir une prison ?" },

{ id:70, category:"Souffrance", level:1, xp:10, question:"La souffrance a-t-elle un sens en elle-même, ou seulement celui que nous décidons de lui donner ?", paradox:"Peut-on transformer une douleur absurde en expérience porteuse de sens ?" },
{ id:71, category:"Souffrance", level:3, xp:20, question:"Grandit-on réellement grâce à la souffrance, ou seulement malgré elle ?", paradox:"La douleur est-elle un maître nécessaire ou un obstacle qu'on surmonte malgré tout ?" },
{ id:72, category:"Souffrance", level:4, xp:25, question:"Peut-on aider quelqu'un à moins souffrir sans jamais lui retirer une leçon qu'il devait apprendre ?", paradox:"Protéger quelqu'un de la douleur peut-il lui nuire à long terme ?" },

{ id:73, category:"Sagesse", level:2, xp:15, question:"La sagesse consiste-t-elle à tout comprendre, ou à accepter ce que l'on ne comprendra jamais ?", paradox:"Peut-on être sage sans jamais atteindre la certitude ?" },
{ id:74, category:"Sagesse", level:3, xp:20, question:"Vieillir rend-il automatiquement plus sage, ou seulement plus habitué à ses propres erreurs ?", paradox:"L'expérience garantit-elle la sagesse ou seulement l'habitude ?" },
{ id:75, category:"Sagesse", level:5, xp:30, question:"Peut-on transmettre la sagesse, ou chacun doit-il la reconquérir par sa propre souffrance ?", paradox:"Un conseil sage suffit-il, ou faut-il l'expérience pour vraiment comprendre ?" },

{ id:76, category:"Religion", level:2, xp:15, question:"Croit-on en une puissance supérieure par conviction, ou par besoin de sens face à l'incertitude ?", paradox:"La foi naît-elle de la vérité ou du besoin de réconfort ?" },
{ id:77, category:"Religion", level:3, xp:20, question:"Une morale a-t-elle besoin d'un fondement divin pour être valable ?", paradox:"Peut-on être profondément moral sans aucune croyance religieuse ?" },
{ id:78, category:"Religion", level:4, xp:25, question:"Le sacré existe-t-il en dehors de la valeur que les hommes lui accordent collectivement ?", paradox:"Un objet est-il sacré en lui-même ou seulement par consensus ?" },

{ id:79, category:"Art", level:1, xp:10, question:"Une œuvre d'art a-t-elle de la valeur en elle-même, ou seulement parce que quelqu'un la regarde et la ressent ?", paradox:"L'art existe-t-il sans un regard pour le recevoir ?" },
{ id:80, category:"Art", level:2, xp:15, question:"Faut-il souffrir pour créer une œuvre profonde, ou est-ce un mythe romantique ?", paradox:"La douleur est-elle une condition de la créativité ou juste une coïncidence fréquente ?" },
{ id:81, category:"Art", level:3, xp:20, question:"Une intelligence artificielle qui crée une œuvre bouleversante produit-elle de l'art, au sens plein du terme ?", paradox:"L'art nécessite-t-il une intention consciente derrière le geste ?" },

{ id:82, category:"Technologie", level:2, xp:15, question:"La technologie nous rapproche-t-elle réellement des autres, ou nous éloigne-t-elle sous couvert de connexion ?", paradox:"Être constamment connecté peut-il coexister avec un sentiment de solitude croissant ?" },
{ id:83, category:"Technologie", level:3, xp:20, question:"Déléguer notre mémoire et notre attention aux machines change-t-il ce que signifie penser ?", paradox:"Penser avec des outils extérieurs est-ce encore penser par soi-même ?" },
{ id:84, category:"Technologie", level:4, xp:25, question:"Si une machine pouvait un jour ressentir la souffrance, aurions-nous le droit de l'utiliser comme un outil ?", paradox:"Le statut moral d'un être dépend-il de sa nature ou de sa capacité à souffrir ?" },

{ id:85, category:"Nature humaine", level:1, xp:10, question:"L'être humain est-il naturellement bon et corrompu par la société, ou naturellement égoïste et discipliné par elle ?", paradox:"La morale vient-elle de notre nature ou de ce qui la contient ?" },
{ id:86, category:"Nature humaine", level:3, xp:20, question:"Sommes-nous capables d'un acte totalement désintéressé, sans aucune trace de bénéfice personnel ?", paradox:"L'altruisme pur existe-t-il ou cache-t-il toujours un intérêt subtil ?" },
{ id:87, category:"Nature humaine", level:4, xp:25, question:"La violence est-elle une déviation de la nature humaine, ou une part inévitable de ce que nous sommes ?", paradox:"Peut-on civiliser complètement une pulsion aussi ancienne que la survie ?" },

{ id:88, category:"Mémoire", level:2, xp:15, question:"Nos souvenirs sont-ils des enregistrements fidèles du passé, ou des reconstructions que nous modifions à chaque rappel ?", paradox:"Peut-on faire confiance à un souvenir qui change chaque fois qu'on s'en souvient ?" },
{ id:89, category:"Mémoire", level:3, xp:20, question:"Oublier une douleur est-ce guérir, ou seulement repousser une blessure non résolue ?", paradox:"L'oubli est-il une guérison ou un évitement ?" },
{ id:90, category:"Mémoire", level:1, xp:10, question:"Vaut-il mieux se souvenir de tout, ou la capacité d'oublier est-elle nécessaire pour avancer ?", paradox:"Une mémoire parfaite serait-elle une bénédiction ou un fardeau ?" },

{ id:91, category:"Choix", level:1, xp:10, question:"Regrettons-nous davantage ce que nous avons fait, ou ce que nous n'avons jamais osé faire ?", paradox:"L'inaction peut-elle peser plus lourd qu'une erreur 