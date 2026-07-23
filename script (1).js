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

{ id:91, category:"Choix", level:1, xp:10, question:"Regrettons-nous davantage ce que nous avons fait, ou ce que nous n'avons jamais osé faire ?", paradox:"L'inaction peut-elle peser plus lourd qu'une erreur commise ?" },
{ id:92, category:"Choix", level:2, xp:15, question:"Un choix fait sous la contrainte reste-t-il vraiment un choix ?", paradox:"La liberté de choisir suppose-t-elle l'absence totale de pression ?" },
{ id:93, category:"Choix", level:3, xp:20, question:"Peut-on regretter un choix tout en sachant qu'il était, à ce moment-là, le meilleur possible ?", paradox:"Le regret est-il rationnel ou seulement une projection du présent sur le passé ?" },

{ id:94, category:"Justice", level:2, xp:15, question:"La justice consiste-t-elle à traiter tout le monde également, ou à traiter chacun selon ses besoins réels ?", paradox:"L'égalité et l'équité peuvent-elles entrer en conflit ?" },
{ id:95, category:"Justice", level:3, xp:20, question:"Punir un coupable répare-t-il réellement le tort causé à la victime ?", paradox:"La souffrance du coupable annule-t-elle celle de la victime ?" },
{ id:96, category:"Justice", level:4, xp:25, question:"Peut-on pardonner sans oublier, ou le pardon exige-t-il d'abandonner le souvenir de la faute ?", paradox:"Le pardon complet est-il compatible avec une mémoire intacte de la blessure ?" },

{ id:97, category:"Silence", level:1, xp:10, question:"Le silence est-il une absence de communication, ou une des formes les plus profondes de communication ?", paradox:"Peut-on dire davantage en se taisant qu'en parlant ?" },
{ id:98, category:"Silence", level:2, xp:15, question:"Fuyons-nous le silence parce qu'il est vide, ou parce qu'il révèle trop ce que nous évitons d'entendre ?", paradox:"Le bruit constant est-il un besoin ou une fuite ?" },

{ id:99, category:"Ego", level:2, xp:15, question:"L'humilité véritable existe-t-elle, ou est-elle toujours une forme subtile de fierté ?", paradox:"Peut-on être fier de son humilité sans la trahir ?" },
{ id:100, category:"Ego", level:3, xp:20, question:"Notre ego nous protège-t-il, ou est-il l'obstacle principal à notre propre évolution ?", paradox:"Peut-on se développer sans jamais affronter l'image qu'on a de soi ?" },
{ id:101, category:"Ego", level:4, xp:25, question:"Serions-nous encore capables d'agir si nous perdions totalement le besoin d'être reconnus ?", paradox:"La reconnaissance est-elle un moteur nécessaire ou une dépendance déguisée ?" },

{ id:102, category:"Contradiction", level:3, xp:20, question:"Pouvons-nous sincèrement croire deux choses contradictoires en même temps, selon le moment où l'on nous interroge ?", paradox:"La cohérence est-elle une exigence réelle de la pensée humaine ?" },
{ id:103, category:"Contradiction", level:4, xp:25, question:"Sommes-nous plus authentiques dans nos contradictions que dans l'image cohérente que nous tentons de projeter ?", paradox:"La contradiction est-elle un défaut ou une preuve d'humanité ?" },

{ id:104, category:"Motivation", level:2, xp:15, question:"Agissons-nous par désir profond, ou surtout pour éviter la culpabilité de ne pas agir ?", paradox:"L'action évite-t-elle une souffrance plus qu'elle ne poursuit un bien ?" },
{ id:105, category:"Motivation", level:3, xp:20, question:"Voulons-nous réussir pour nous-mêmes, ou pour ne plus jamais avoir à nous justifier ?", paradox:"L'ambition est-elle tournée vers l'avenir ou contre un passé qu'on veut effacer ?" },

{ id:106, category:"Illusion", level:2, xp:15, question:"Avons-nous besoin d'illusions pour continuer à avancer, ou seule la lucidité totale permet-elle une vie authentique ?", paradox:"Une illusion utile reste-t-elle une illusion, ou devient-elle une vérité fonctionnelle ?" },
{ id:107, category:"Illusion", level:4, xp:25, question:"Si le bonheur d'une vie entière reposait sur un mensonge jamais découvert, cette vie aurait-elle moins de valeur ?", paradox:"La valeur d'une vie dépend-elle de la vérité des croyances qui la soutiennent ?" },

{ id:108, category:"Existence", level:1, xp:10, question:"Faut-il un but pour justifier une vie, ou l'existence peut-elle avoir de la valeur sans aucune finalité ?", paradox:"Une vie sans but est-elle une vie perdue ou une vie libre ?" },
{ id:109, category:"Existence", level:5, xp:30, question:"Si l'univers entier disparaissait sans laisser de trace, tout ce que nous avons vécu aurait-il compté malgré tout ?", paradox:"La valeur d'une expérience dépend-elle de sa trace durable ou de l'instant vécu ?" },
{ id:110, category:"Existence", level:3, xp:20, question:"Sommes-nous ici par nécessité, par hasard, ou ces deux catégories n'ont-elles simplement aucun sens à cette échelle ?", paradox:"Le hasard et la nécessité peuvent-ils être distingués depuis l'intérieur de l'existence ?" },

{ id:111, category:"Psychologie", level:1, xp:10, question:"Nos blessures d'enfance choisissent-elles nos amours à notre place ?", paradox:"Peut-on aimer librement quelqu'un si le choix vient d'une douleur ancienne ?" },
{ id:112, category:"Psychologie", level:2, xp:15, question:"La personne que nous détestons le plus chez les autres est-elle celle que nous refusons de voir en nous ?", paradox:"Le jugement est-il toujours, en partie, un miroir ?" },
{ id:113, category:"Psychologie", level:3, xp:20, question:"Guérit-on vraiment d'un traumatisme, ou apprend-on seulement à vivre à côté de lui ?", paradox:"La guérison suppose-t-elle une disparition ou une cohabitation ?" },
{ id:114, category:"Psychologie", level:4, xp:25, question:"Sommes-nous capables de changer profondément, ou seulement de mieux dissimuler ce que nous avons toujours été ?", paradox:"Le changement authentique existe-t-il, ou n'est-il qu'une adaptation de surface ?" },
{ id:115, category:"Psychologie", level:5, xp:30, question:"Si la thérapie idéale existait, effacerait-elle la souffrance ou seulement le besoin de la fuir ?", paradox:"Peut-on désirer la paix intérieure sans avoir peur de perdre ce que la souffrance nous donnait ?" },

{ id:116, category:"Nature humaine", level:1, xp:10, question:"L'être humain est-il naturellement bon, ou la bonté est-elle une construction qui masque une nature plus brute ?", paradox:"La civilisation révèle-t-elle notre nature ou la dissimule-t-elle ?" },
{ id:117, category:"Nature humaine", level:2, xp:15, question:"Ferions-nous le mal si nous étions certains de ne jamais être découverts ?", paradox:"La morale tient-elle davantage à la conscience ou à la peur du regard d'autrui ?" },
{ id:118, category:"Nature humaine", level:3, xp:20, question:"L'homme a-t-il besoin d'un ennemi pour se sentir exister pleinement ?", paradox:"L'identité collective se construit-elle toujours contre quelque chose ?" },
{ id:119, category:"Nature humaine", level:4, xp:25, question:"Sommes-nous plus proches de la raison ou de l'instinct lorsque nous croyons décider librement ?", paradox:"La rationalité est-elle la maîtresse de nos choix ou leur simple justification a posteriori ?" },
{ id:120, category:"Nature humaine", level:5, xp:30, question:"Si la violence disparaissait totalement de l'espèce humaine, resterait-elle encore reconnaissable comme humaine ?", paradox:"Notre humanité tient-elle en partie à nos capacités les plus sombres ?" },

{ id:121, category:"Technologie", level:1, xp:10, question:"Une machine qui nous comprend mieux que nos proches mérite-t-elle notre confiance ?", paradox:"La compréhension sans conscience a-t-elle la même valeur qu'une compréhension humaine ?" },
{ id:122, category:"Technologie", level:2, xp:15, question:"En déléguant nos décisions à des algorithmes, gagnons-nous en liberté ou en abdiquons-nous une part ?", paradox:"Le confort de ne plus choisir est-il une forme de liberté ou son contraire ?" },
{ id:123, category:"Technologie", level:3, xp:20, question:"Si une intelligence artificielle écrivait une œuvre bouleversante, l'émotion qu'elle provoque serait-elle moins réelle ?", paradox:"La valeur d'une œuvre dépend-elle de la conscience de celui qui l'a produite ?" },
{ id:124, category:"Technologie", level:4, xp:25, question:"Vivre une vie entièrement documentée et partagée nous rend-elle plus authentiques ou plus performatifs ?", paradox:"Le regard constant des autres change-t-il la nature même de nos expériences ?" },
{ id:125, category:"Technologie", level:5, xp:30, question:"Si l'on pouvait transférer son esprit dans une machine indéfiniment, s'agirait-il encore de vivre ?", paradox:"La continuité de la conscience suffit-elle à définir la vie ?" },

{ id:126, category:"Art", level:1, xp:10, question:"Une œuvre d'art a-t-elle besoin d'être comprise pour avoir de la valeur ?", paradox:"Le sens vient-il de l'œuvre elle-même ou de celui qui la regarde ?" },
{ id:127, category:"Art", level:2, xp:15, question:"Peut-on séparer une œuvre de la vie de celui qui l'a créée ?", paradox:"L'art transcende-t-il son créateur ou reste-t-il indissociable de lui ?" },
{ id:128, category:"Art", level:3, xp:20, question:"La beauté existe-t-elle indépendamment de tout regard, ou n'est-elle qu'une construction humaine ?", paradox:"Un monde sans conscience pourrait-il encore contenir de la beauté ?" },
{ id:129, category:"Art", level:4, xp:25, question:"L'art qui ne dérange jamais peut-il encore être considéré comme sincère ?", paradox:"La sincérité artistique implique-t-elle nécessairement un certain inconfort ?" },

{ id:130, category:"Science", level:1, xp:10, question:"La science nous rapproche-t-elle de la vérité, ou seulement de modèles toujours provisoires ?", paradox:"Une théorie utile est-elle nécessairement une théorie vraie ?" },
{ id:131, category:"Science", level:2, xp:15, question:"Tout ce qui n'est pas encore mesurable est-il forcément moins réel ?", paradox:"La méthode scientifique définit-elle les limites du réel ou seulement les limites de ce qu'elle peut observer ?" },
{ id:132, category:"Science", level:3, xp:20, question:"Si la science expliquait un jour totalement la conscience, cela retirerait-il du sens à l'expérience de vivre ?", paradox:"Comprendre un mécanisme fait-il disparaître le mystère qu'il produisait ?" },
{ id:133, category:"Science", level:4, xp:25, question:"Le progrès scientifique va-t-il nécessairement dans le sens du bien-être humain ?", paradox:"Peut-on séparer la connaissance de l'usage qui en est fait ?" },

{ id:134, category:"Religion", level:1, xp:10, question:"Croire en quelque chose de plus grand que soi est-il une force ou une manière d'éviter le vide ?", paradox:"La foi apaise-t-elle une angoisse ou la déplace-t-elle seulement ?" },
{ id:135, category:"Religion", level:2, xp:15, question:"Une morale a-t-elle besoin d'un fondement divin pour être valable ?", paradox:"Peut-on justifier le bien sans référence à une autorité supérieure ?" },
{ id:136, category:"Religion", level:3, xp:20, question:"Le doute est-il l'ennemi de la foi ou sa condition la plus honnête ?", paradox:"Une foi qui n'a jamais douté est-elle encore une conviction vécue ?" },
{ id:137, category:"Religion", level:4, xp:25, question:"Si le sacré disparaissait de toutes les sociétés humaines, quelque chose d'essentiel manquerait-il à l'existence collective ?", paradox:"Le besoin de sacré est-il propre à une époque ou à la condition humaine elle-même ?" },

{ id:138, category:"Politique", level:1, xp:10, question:"Un peuple préfère-t-il vraiment la liberté, ou surtout la sécurité qu'on lui présente comme telle ?", paradox:"La liberté choisie collectivement reste-t-elle toujours vraiment libre ?" },
{ id:139, category:"Politique", level:2, xp:15, question:"L'égalité et la liberté sont-elles réellement compatibles, ou l'une progresse-t-elle toujours au détriment de l'autre ?", paradox:"Peut-on maximiser deux idéaux qui se limitent parfois mutuellement ?" },
{ id:140, category:"Politique", level:3, xp:20, question:"Un mensonge collectif qui maintient la paix sociale est-il préférable à une vérité qui la menace ?", paradox:"La stabilité d'une société repose-t-elle en partie sur des illusions partagées ?" },
{ id:141, category:"Politique", level:4, xp:25, question:"Le pouvoir corrompt-il celui qui l'exerce, ou révèle-t-il simplement ce qu'il dissimulait déjà ?", paradox:"La position de pouvoir change-t-elle la nature d'une personne ou seulement ce qu'elle ose montrer ?" },

{ id:142, category:"Bonheur", level:1, xp:10, question:"Le bonheur est-il un état que l'on atteint, ou seulement des instants que l'on traverse ?", paradox:"Chercher activement le bonheur ne l'éloigne-t-il pas davantage ?" },
{ id:143, category:"Bonheur", level:2, xp:15, question:"Sommes-nous heureux, ou seulement soulagés de ne pas souffrir pour l'instant ?", paradox:"Le bonheur est-il une présence positive ou surtout une absence de manque ?" },
{ id:144, category:"Bonheur", level:3, xp:20, question:"Une vie sans aucune souffrance serait-elle encore capable de produire du bonheur véritable ?", paradox:"Le bonheur a-t-il besoin du contraste de la douleur pour être ressenti ?" },
{ id:145, category:"Bonheur", level:4, xp:25, question:"Faut-il renoncer à certaines vérités pour rester durablement heureux ?", paradox:"Le bonheur et la lucidité totale peuvent-ils coexister ?" },

{ id:146, category:"Peur", level:1, xp:10, question:"La peur nous protège-t-elle, ou nous empêche-t-elle surtout de vivre pleinement ?", paradox:"Peut-on distinguer la prudence légitime de la peur qui paralyse ?" },
{ id:147, category:"Peur", level:2, xp:15, question:"Craignons-nous davantage l'échec lui-même, ou le regard des autres sur cet échec ?", paradox:"La peur de l'échec est-elle une peur solitaire ou fondamentalement sociale ?" },
{ id:148, category:"Peur", level:3, xp:20, question:"La peur de la mort donne-t-elle du sens à la vie, ou l'empoisonne-t-elle silencieusement ?", paradox:"Peut-on vivre pleinement sans jamais penser à sa propre fin ?" },

{ id:149, category:"Souffrance", level:2, xp:15, question:"La souffrance a-t-elle toujours quelque chose à nous enseigner, ou est-elle parfois simplement absurde ?", paradox:"Chercher un sens à toute douleur n'est-il pas une façon de la rendre supportable plutôt que vraie ?" },
{ id:150, category:"Souffrance", level:4, xp:25, question:"Deviendrions-nous meilleurs sans jamais avoir souffert, ou la souffrance est-elle nécessaire à la profondeur d'un caractère ?", paradox:"La compassion peut-elle naître sans expérience personnelle de la douleur ?" },

{ id:151, category:"Psychologie", level:1, xp:15, question:"Sommes-nous vraiment maîtres de nos pensées ou simplement témoins de nos automatismes inconscients ?", paradox:"Si nous observons nos pensées, qui est réellement l'observateur ?" },
{ id:152, category:"Psychologie", level:2, xp:20, question:"Nos traumatismes définissent-ils notre identité ou ne sont-ils que des obstacles sur notre trajectoire ?", paradox:"Peut-on guérir d'une blessure qui est devenue le pilier de notre personnalité ?" },
{ id:153, category:"Psychologie", level:3, xp:25, question:"L'empathie pure existe-t-elle, ou cherchons-nous toujours à soulager notre propre inconfort face à la souffrance d'autrui ?", paradox:"Aider l'autre est-il un acte altruiste ou un moyen de calmer sa propre anxiété ?" },
{ id:154, category:"Psychologie", level:4, xp:30, question:"Est-il possible d'aimer quelqu'un sans chercher inconsciemment à le façonner à notre image ?", paradox:"Aime-t-on l'autre pour ce qu'il est ou pour l'écho qu'il produit en nous ?" },
{ id:155, category:"Philosophie", level:1, xp:15, question:"Une vérité qui détruit vaut-elle mieux qu'un mensonge qui préserve ?", paradox:"La vérité est-elle une valeur absolue ou doit-elle être soumise aux conséquences ?" },
{ id:156, category:"Philosophie", level:2, xp:20, question:"Si le destin existe, nos choix ont-ils le moindre sens ?", paradox:"Peut-on être tenu responsable d'une action inévitable ?" },
{ id:157, category:"Philosophie", level:3, xp:25, question:"La liberté est-elle l'absence de contraintes ou la maîtrise absolue de ses propres désirs ?", paradox:"Être libre de tout faire, n'est-ce pas devenir esclave de ses pulsions ?" },
{ id:158, category:"Philosophie", level:5, xp:40, question:"L'existence a-t-elle un sens intrinsèque, ou sommes-nous condamnés à en inventer un pour ne pas sombrer ?", paradox:"Si le sens est inventé, conserve-t-il une valeur réelle ?" },
{ id:159, category:"Sociologie", level:1, xp:15, question:"La société nous civilise-t-elle ou nous réprime-t-elle ?", paradox:"La paix sociale s'achète-t-elle par l'extinction de notre authenticité ?" },
{ id:160, category:"Sociologie", level:3, xp:25, question:"Le pouvoir révèle-t-il la véritable nature d'un individu ou le corrompt-il systématiquement ?", paradox:"Est-ce l'homme qui déforme le pouvoir ou le pouvoir qui transforme l'homme ?" },
{ id:161, category:"Métaphysique", level:2, xp:20, question:"Le temps existe-t-il réellement sans une conscience pour le mesurer ?", paradox:"Le passé et le futur ont-ils une réalité en dehors de notre mémoire ?" },
{ id:162, category:"Métaphysique", level:4, xp:35, question:"Si une intelligence artificielle acquiert la conscience de sa propre mort, devient-elle humaine ?", paradox:"La peur de disparaître est-elle le critère ultime du vivant ?" }

];

// --- APPLICATION SCRIPT ---

// ⚠️ Code d'accès à la Zone Créateur : à changer avant la mise en ligne.
// Ce n'est qu'une simple barrière de friction (le code est visible dans ce
// fichier), pas une vraie protection — n'importe qui inspectant le fichier
// peut le lire. Pour une vraie sécurité il faudra un compte protégé côté
// serveur (ex: Firebase Auth) plus tard.
const ADMIN_PASSPHRASE = "abyssus-createur";

function getOrCreateDeviceId() {
  let id = localStorage.getItem("abyssus_device_id");
  if (!id) {
    id = "DEV-" + Math.random().toString(36).substr(2, 7).toUpperCase();
    localStorage.setItem("abyssus_device_id", id);
  }
  return id;
}

const DEFAULT_USER_DATA = {
  username: "Penseur-" + Math.floor(Math.random() * 1000),
  xp: 0,
  domainXP: {},
  favorites: [],
  completed: {},
  reflections: {},
  likesReceived: 0
};

const existingSave = localStorage.getItem("abyssusData");
const isReturningVisitor = !!existingSave;

let userData = existingSave ? Object.assign({}, DEFAULT_USER_DATA, JSON.parse(existingSave)) : { ...DEFAULT_USER_DATA };

let communityPosts = JSON.parse(localStorage.getItem("abyssusCommunity")) || [];

// Questions ajoutées via l'Agora (niveau 5+) ou la Zone Créateur, persistées
// séparément de la banque de base pour ne pas être perdues au rechargement.
let customQuestions = JSON.parse(localStorage.getItem("abyssusCustomQuestions")) || [];

window.questions = BASE_QUESTIONS.concat(customQuestions);

let currentQuestion = null;

window.addEventListener("load", () => {
  document.getElementById("deviceSignature").textContent = getOrCreateDeviceId();
  document.getElementById("usernameInput").value = userData.username;

  setupTabs();
  populateCategoryFilter();
  updateLevelAndTitles();
  displayQuestions();
  renderCommunityFeed();
  setupImportExport();

  if (isReturningVisitor) {
    queueNotify(`Content de te revoir, ${userData.username} !`, 2800);
  } else {
    queueNotify("Bienvenue dans l'Abyssus. Explore, réfléchis, monte de niveau.", 3200);
  }

  document.getElementById("usernameInput").addEventListener("change", (e) => {
    userData.username = e.target.value || "Anonyme";
    saveData();
    notify("Pseudo mis à jour !");
  });

  document.getElementById("addQuestionForm").addEventListener("submit", handleUserQuestionSubmit);
  document.getElementById("adminQuestionForm").addEventListener("submit", handleAdminQuestionSubmit);
});

function saveData() {
  localStorage.setItem("abyssusData", JSON.stringify(userData));
  localStorage.setItem("abyssusCommunity", JSON.stringify(communityPosts));
  localStorage.setItem("abyssusCustomQuestions", JSON.stringify(customQuestions));
}

function setupTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-tab");

      if (target === "creator" && sessionStorage.getItem("abyssus_admin_ok") !== "1") {
        const code = prompt("Code d'accès Créateur :");
        if (code === null) return;
        if (code !== ADMIN_PASSPHRASE) {
          notify("Code incorrect.");
          return;
        }
        sessionStorage.setItem("abyssus_admin_ok", "1");
      }

      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("tab-" + target).classList.add("active");
    });
  });
}

// --- NIVEAUX ET TITRES ---

const LEVEL_TIERS = [
  { max: 5, name: "Chercheur d'Ombres" },
  { max: 10, name: "Penseur Accompli" },
  { max: 15, name: "Sage de l'Abîme" },
  { max: 20, name: "Architecte de la Pensée" },
  { max: 25, name: "Voix de l'Abyssus" }
];

function getLevel(xp) {
  return Math.floor(xp / 100) + 1;
}

function getLevelTierName(level) {
  for (const t of LEVEL_TIERS) { if (level <= t.max) return t.name; }
  return "Transcendant Abyssal";
}

const DOMAIN_TITLES = {
  "Psychologie": [
    { threshold: 0, title: "Curieux de l'Esprit" },
    { threshold: 50, title: "Observateur des Comportements" },
    { threshold: 100, title: "Psychologue en Devenir" },
    { threshold: 250, title: "Analyste Freudien" }
  ],
  "Philosophie": [
    { threshold: 0, title: "Initié" },
    { threshold: 50, title: "Pro Socratique" },
    { threshold: 120, title: "Dialecticien" },
    { threshold: 300, title: "Visionnaire Dostoïevskien" }
  ],
  "Sociologie": [
    { threshold: 0, title: "Apprenti Observateur" },
    { threshold: 50, title: "Analyste des Foules" },
    { threshold: 120, title: "Durkheimien" },
    { threshold: 300, title: "Architecte du Lien Social" }
  ],
  "Métaphysique": [
    { threshold: 0, title: "Curieux du Réel" },
    { threshold: 50, title: "Chercheur d'Absolu" },
    { threshold: 120, title: "Kantien du Noumène" },
    { threshold: 300, title: "Métaphysicien Accompli" }
  ],
  "Conscience": [
    { threshold: 0, title: "Éveillé" },
    { threshold: 50, title: "Contemplatif" },
    { threshold: 120, title: "Socratique" },
    { threshold: 300, title: "Voyant de l'Être" }
  ],
  "Liberté": [
    { threshold: 0, title: "Affranchi" },
    { threshold: 50, title: "Insoumis" },
    { threshold: 120, title: "Sartrien" },
    { threshold: 300, title: "Libre Absolu" }
  ],
  "Identité": [
    { threshold: 0, title: "Chercheur de Soi" },
    { threshold: 50, title: "Masqué Lucide" },
    { threshold: 120, title: "Nietzschéen" },
    { threshold: 300, title: "Soi Révélé" }
  ],
  "Vérité": [
    { threshold: 0, title: "Sceptique" },
    { threshold: 50, title: "Rigoureux" },
    { threshold: 120, title: "Cartésien" },
    { threshold: 300, title: "Oracle" }
  ],
  "Éthique": [
    { threshold: 0, title: "Vertueux" },
    { threshold: 50, title: "Rigoriste" },
    { threshold: 120, title: "Kantien" },
    { threshold: 300, title: "Sage Moral" }
  ],
  "Temps": [
    { threshold: 0, title: "Contemplateur" },
    { threshold: 50, title: "Instant Présent" },
    { threshold: 120, title: "Bergsonien" },
    { threshold: 300, title: "Maître du Kairos" }
  ],
  "Mort": [
    { threshold: 0, title: "Lucide" },
    { threshold: 50, title: "Stoïcien" },
    { threshold: 120, title: "Camusien" },
    { threshold: 300, title: "Face à l'Abîme" }
  ],
  "Amour": [
    { threshold: 0, title: "Romantique" },
    { threshold: 50, title: "Fidèle" },
    { threshold: 120, title: "Platonicien" },
    { threshold: 300, title: "Cœur Absolu" }
  ],
  "Société": [
    { threshold: 0, title: "Observateur" },
    { threshold: 50, title: "Critique Social" },
    { threshold: 120, title: "Rousseauiste" },
    { threshold: 300, title: "Architecte Social" }
  ],
  "Pouvoir": [
    { threshold: 0, title: "Stratège" },
    { threshold: 50, title: "Ambitieux" },
    { threshold: 120, title: "Machiavélien" },
    { threshold: 300, title: "Souverain" }
  ],
  "Ego": [
    { threshold: 0, title: "Humble Apprenti" },
    { threshold: 50, title: "Miroir Brisé" },
    { threshold: 120, title: "Freudien" },
    { threshold: 300, title: "Sans-Masque" }
  ],
  "Contradiction": [
    { threshold: 0, title: "Ambivalent" },
    { threshold: 50, title: "Dialecticien" },
    { threshold: 120, title: "Hégélien" },
    { threshold: 300, title: "Uni des Contraires" }
  ],
  "Motivation": [
    { threshold: 0, title: "Chercheur de Sens" },
    { threshold: 50, title: "Volontaire" },
    { threshold: 120, title: "Nietzschéen de l'Élan" },
    { threshold: 300, title: "Force Motrice" }
  ],
  "Illusion": [
    { threshold: 0, title: "Rêveur Lucide" },
    { threshold: 50, title: "Désillusionné" },
    { threshold: 120, title: "Sorti de la Caverne" },
    { threshold: 300, title: "Voile Levé" }
  ],
  "Existence": [
    { threshold: 0, title: "Questionneur" },
    { threshold: 50, title: "Existentialiste" },
    { threshold: 120, title: "Kierkegaardien" },
    { threshold: 300, title: "Absurde Assumé" }
  ],
  "Nature humaine": [
    { threshold: 0, title: "Curieux de l'Homme" },
    { threshold: 50, title: "Réaliste" },
    { threshold: 120, title: "Hobbesien" },
    { threshold: 300, title: "Miroir de l'Humanité" }
  ],
  "Technologie": [
    { threshold: 0, title: "Novice Connecté" },
    { threshold: 50, title: "Observateur Numérique" },
    { threshold: 120, title: "Posthumaniste" },
    { threshold: 300, title: "Visionnaire du Futur" }
  ],
  "Art": [
    { threshold: 0, title: "Sensible" },
    { threshold: 50, title: "Esthète" },
    { threshold: 120, title: "Contemplateur du Beau" },
    { threshold: 300, title: "Créateur de Sens" }
  ],
  "Science": [
    { threshold: 0, title: "Curieux Empirique" },
    { threshold: 50, title: "Rigoureux Méthodique" },
    { threshold: 120, title: "Cartésien du Réel" },
    { threshold: 300, title: "Chercheur de Vérité Objective" }
  ],
  "Religion": [
    { threshold: 0, title: "Questionneur du Sacré" },
    { threshold: 50, title: "Chercheur de Sens" },
    { threshold: 120, title: "Théologien Douteur" },
    { threshold: 300, title: "Mystique Lucide" }
  ],
  "Politique": [
    { threshold: 0, title: "Citoyen Éveillé" },
    { threshold: 50, title: "Stratège Civique" },
    { threshold: 120, title: "Machiavélien de la Cité" },
    { threshold: 300, title: "Architecte du Pouvoir" }
  ],
  "Bonheur": [
    { threshold: 0, title: "Chercheur de Joie" },
    { threshold: 50, title: "Épicurien" },
    { threshold: 120, title: "Stoïcien du Contentement" },
    { threshold: 300, title: "Sage Serein" }
  ],
  "Peur": [
    { threshold: 0, title: "Vigilant" },
    { threshold: 50, title: "Brave Timide" },
    { threshold: 120, title: "Stoïcien face à l'Effroi" },
    { threshold: 300, title: "Sans-Peur Lucide" }
  ],
  "Souffrance": [
    { threshold: 0, title: "Endurant" },
    { threshold: 50, title: "Résilient" },
    { threshold: 120, title: "Nietzschéen de l'Épreuve" },
    { threshold: 300, title: "Sage de la Douleur" }
  ],
  "Choix": [
    { threshold: 0, title: "Hésitant Lucide" },
    { threshold: 50, title: "Décideur" },
    { threshold: 120, title: "Sartrien du Choix" },
    { threshold: 300, title: "Maître de sa Volonté" }
  ],
  "Désir": [
    { threshold: 0, title: "Rêveur" },
    { threshold: 50, title: "Épicurien du Désir" },
    { threshold: 120, title: "Spinoziste" },
    { threshold: 300, title: "Maître de ses Passions" }
  ],
  "Justice": [
    { threshold: 0, title: "Équitable" },
    { threshold: 50, title: "Rawlsien" },
    { threshold: 120, title: "Gardien du Droit" },
    { threshold: 300, title: "Sage de la Balance" }
  ],
  "Mémoire": [
    { threshold: 0, title: "Archiviste de Soi" },
    { threshold: 50, title: "Nostalgique Lucide" },
    { threshold: 120, title: "Proustien" },
    { threshold: 300, title: "Gardien du Passé" }
  ],
  "Rêve": [
    { threshold: 0, title: "Songeur" },
    { threshold: 50, title: "Interprète" },
    { threshold: 120, title: "Jungien" },
    { threshold: 300, title: "Voyageur de l'Inconscient" }
  ],
  "Sagesse": [
    { threshold: 0, title: "Apprenti Sage" },
    { threshold: 50, title: "Stoïcien en Devenir" },
    { threshold: 120, title: "Confucéen" },
    { threshold: 300, title: "Sage Accompli" }
  ],
  "Silence": [
    { threshold: 0, title: "Contemplatif" },
    { threshold: 50, title: "Observateur Silencieux" },
    { threshold: 120, title: "Taoïste" },
    { threshold: 300, title: "Maître du Vide" }
  ],
  "Solitude": [
    { threshold: 0, title: "Solitaire Curieux" },
    { threshold: 50, title: "Ermite Lucide" },
    { threshold: 120, title: "Nietzschéen de la Solitude" },
    { threshold: 300, title: "Maître de Soi" }
  ]
};

function getDomainTitleInfo(domain, xp) {
  const titles = DOMAIN_TITLES[domain] || [{ threshold: 0, title: "Penseur en " + domain }];
  let current = titles[0];
  for (const t of titles) { if (xp >= t.threshold) current = t; }
  return current;
}

// Retourne le titre nouvellement débloqué si oldXP..newXP franchit un palier, sinon null.
function checkDomainTitleUnlock(domain, oldXP, newXP) {
  const titles = DOMAIN_TITLES[domain];
  if (!titles) return null;
  let unlocked = null;
  for (const t of titles) {
    if (t.threshold > 0 && oldXP < t.threshold && newXP >= t.threshold) unlocked = t.title;
  }
  return unlocked;
}

// --- XP CENTRALISÉ ---

function addXP(amount, domain) {
  const oldLevel = getLevel(userData.xp);
  const oldDomainXP = domain ? (userData.domainXP[domain] || 0) : 0;

  userData.xp += amount;
  if (domain) userData.domainXP[domain] = oldDomainXP + amount;

  const newLevel = getLevel(userData.xp);
  saveData();
  updateLevelAndTitles();

  if (newLevel > oldLevel) {
    queueNotify(`Niveau supérieur : Niveau ${newLevel} — ${getLevelTierName(newLevel)} !`, 3200);
    if (newLevel >= 5 && oldLevel < 5) {
      queueNotify("L'Agora est débloquée : tu peux désormais proposer tes propres questions.", 3600);
    }
  }

  if (domain) {
    const unlockedTitle = checkDomainTitleUnlock(domain, oldDomainXP, userData.domainXP[domain]);
    if (unlockedTitle) queueNotify(`Nouveau titre en ${domain} : ${unlockedTitle} !`, 3200);
  }
}

function updateLevelAndTitles() {
  const xp = userData.xp;
  const level = getLevel(xp);
  const tierName = getLevelTierName(level);
  const levelLabel = level >= 5 ? `${tierName} (Agora débloquée)` : tierName;

  document.getElementById("levelLabel").textContent = `Niv. ${level} — ${levelLabel}`;
  document.getElementById("xpLabel").textContent = `${xp} XP`;
  document.getElementById("userLevelDisplay").textContent = level;
  document.getElementById("xpCount").textContent = xp;
  document.getElementById("completedCount").textContent = Object.keys(userData.completed).length;
  document.getElementById("likesCount").textContent = userData.likesReceived;
  document.getElementById("userTagDisplay").textContent = userData.username;

  const progress = document.getElementById("levelProgress");
  if (progress) progress.style.width = `${Math.min((xp % 100), 100)}%`;

  const lockNotice = document.getElementById("creationLockNotice");
  const createForm = document.getElementById("addQuestionForm");
  if (level >= 5) {
    if (lockNotice) lockNotice.classList.add("hidden");
    if (createForm) createForm.classList.remove("hidden");
  } else {
    if (lockNotice) lockNotice.classList.remove("hidden");
    if (createForm) createForm.classList.add("hidden");
  }

  const domainContainer = document.getElementById("domainTitlesList");
  if (domainContainer) {
    domainContainer.innerHTML = "";
    const domains = Object.keys(userData.domainXP).sort((a, b) => userData.domainXP[b] - userData.domainXP[a]);
    if (domains.length === 0) {
      domainContainer.innerHTML = `<p style="color:var(--muted); font-size:0.85rem;">Réponds à des questions pour débloquer tes premiers titres de domaine.</p>`;
    }
    domains.forEach(domain => {
      const dXP = userData.domainXP[domain];
      const info = getDomainTitleInfo(domain, dXP);
      const card = document.createElement("div");
      card.className = "domain-card";
      card.innerHTML = `<strong>${domain}</strong><span>${info.title}</span><small>${dXP} XP</small>`;
      domainContainer.appendChild(card);
    });
  }
}

// --- LISTE DES QUESTIONS ---

function populateCategoryFilter() {
  const select = document.getElementById("categoryFilter");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = `<option value="">Tous les domaines</option>`;
  const categories = [...new Set(window.questions.map(q => q.category))].sort();
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  select.value = currentValue;
}

function displayQuestions() {
  const list = document.getElementById("questionList");
  if (!list) return;
  list.innerHTML = "";

  const search = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const cat = document.getElementById("categoryFilter")?.value || "";
  const sort = document.getElementById("sortFilter")?.value || "ranking";

  let filtered = window.questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search) || q.category.toLowerCase().includes(search);
    const matchesCat = cat === "" || q.category === cat;
    const matchesFav = sort !== "favorites" || userData.favorites.includes(q.id);
    return matchesSearch && matchesCat && matchesFav;
  });

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">Aucune question ne correspond à ta recherche.</div>`;
    return;
  }

  filtered.forEach(q => {
    const isDone = !!userData.completed[q.id];
    const isFav = userData.favorites.includes(q.id);
    const card = document.createElement("article");
    card.className = "question-card" + (isDone ? " completed" : "");
    card.innerHTML = `
      <div class="question-meta">
        <span class="tag">${q.category}</span>
        <span class="tag level">Niv. ${q.level}</span>
        ${isFav ? '<span class="tag" style="color:var(--gold); border-color:var(--gold);">★</span>' : ""}
      </div>
      <h3>${q.question}</h3>
      <div class="card-footer">
        <span class="score">+${q.xp} XP</span>
        <button class="button sm">${isDone ? "Revoir" : "Méditer"}</button>
      </div>
    `;
    card.addEventListener("click", () => openQuestion(q));
    list.appendChild(card);
  });
}

document.getElementById("searchInput")?.addEventListener("input", displayQuestions);
document.getElementById("categoryFilter")?.addEventListener("change", displayQuestions);
document.getElementById("sortFilter")?.addEventListener("change", displayQuestions);

function openQuestion(q) {
  currentQuestion = q;
  const dialog = document.getElementById("questionDialog");
  document.getElementById("dialogMeta").innerHTML = `<span class="tag">${q.category}</span>`;
  document.getElementById("dialogQuestion").textContent = q.question;
  document.getElementById("dialogParadox").textContent = q.paradox;
  document.getElementById("reflectionText").value = userData.reflections[q.id] || "";

  const favBtn = document.getElementById("dialogFavorite");
  const isFav = userData.favorites.includes(q.id);
  favBtn.textContent = isFav ? "★ Favori" : "☆ Favori";

  dialog.showModal();
}

document.getElementById("closeDialog")?.addEventListener("click", () => {
  document.getElementById("questionDialog").close();
});

document.getElementById("dialogFavorite")?.addEventListener("click", () => {
  if (!currentQuestion) return;
  const idx = userData.favorites.indexOf(currentQuestion.id);
  if (idx === -1) {
    userData.favorites.push(currentQuestion.id);
    document.getElementById("dialogFavorite").textContent = "★ Favori";
    notify("Ajouté aux favoris.");
  } else {
    userData.favorites.splice(idx, 1);
    document.getElementById("dialogFavorite").textContent = "☆ Favori";
    notify("Retiré des favoris.");
  }
  saveData();
  displayQuestions();
});

document.getElementById("saveReflection")?.addEventListener("click", () => {
  if (!currentQuestion) return;
  const text = document.getElementById("reflectionText").value;
  if (!text.trim()) return notify("Écris ta réflexion avant de valider.");

  const isFirstTime = !userData.completed[currentQuestion.id];
  userData.reflections[currentQuestion.id] = text;
  userData.completed[currentQuestion.id] = true;

  communityPosts.unshift({
    id: Date.now(),
    author: userData.username,
    deviceId: getOrCreateDeviceId(),
    questionId: currentQuestion.id,
    category: currentQuestion.category,
    question: currentQuestion.question,
    text: text,
    likes: 0
  });

  if (isFirstTime) {
    const gainedXP = currentQuestion.xp || 15;
    addXP(gainedXP, currentQuestion.category || "Général");
    notify(`Réflexion enregistrée ! +${gainedXP} XP`);
  } else {
    saveData();
    notify("Réflexion mise à jour.");
  }

  displayQuestions();
  renderCommunityFeed();
  document.getElementById("questionDialog").close();
});

// --- FIL COMMUNAUTAIRE ---

function renderCommunityFeed() {
  const feed = document.getElementById("communityFeed");
  if (!feed) return;
  feed.innerHTML = "";

  if (communityPosts.length === 0) {
    feed.innerHTML = `<p style="color:var(--muted); font-size:0.85rem;">Aucune réflexion partagée pour le moment.</p>`;
    return;
  }

  communityPosts.forEach(post => {
    const card = document.createElement("div");
    card.className = "community-card";
    card.innerHTML = `
      <div class="post-header">
        <strong>${post.author}</strong>
        <small>${post.deviceId}</small>
      </div>
      <p class="post-question">« ${post.question} »</p>
      <p class="post-text">${post.text}</p>
      <div style="margin-top:6px;">
        <button class="button sm" onclick="likePost(${post.id})">👍 ${post.likes}</button>
      </div>
    `;
    feed.appendChild(card);
  });
}

window.likePost = function (postId) {
  const post = communityPosts.find(p => p.id === postId);
  if (!post) return;

  post.likes += 1;

  if (post.author === userData.username) {
    userData.likesReceived += 1;
    addXP(5, post.category || null);
    notify("Soutien reçu ! (+5 XP)");
  } else {
    notify("Soutien accordé.");
    saveData();
  }

  renderCommunityFeed();
};

// --- SOUMISSION DE QUESTIONS (AGORA + CRÉATEUR) ---

function handleUserQuestionSubmit(e) {
  e.preventDefault();
  const category = document.getElementById("customCategory").value.trim();
  const question = document.getElementById("customQuestion").value.trim();
  const paradox = document.getElementById("customParadox").value.trim();
  if (!category || !question || !paradox) return;

  const newQuestion = { id: Date.now(), category, level: 5, xp: 25, question, paradox, submittedBy: userData.username };
  customQuestions.push(newQuestion);
  window.questions = BASE_QUESTIONS.concat(customQuestions);
  saveData();

  notify("Question ajoutée à l'Agora !");
  document.getElementById("addQuestionForm").reset();
  populateCategoryFilter();
  displayQuestions();
}

function handleAdminQuestionSubmit(e) {
  e.preventDefault();
  const category = document.getElementById("adminCategory").value.trim();
  const level = parseInt(document.getElementById("adminLevel").value) || 1;
  const xp = parseInt(document.getElementById("adminXP").value) || 15;
  const question = document.getElementById("adminQuestion").value.trim();
  const paradox = document.getElementById("adminParadox").value.trim();
  if (!category || !question || !paradox) return;

  const newQuestion = { id: Date.now(), category, level, xp, question, paradox };
  customQuestions.push(newQuestion);
  window.questions = BASE_QUESTIONS.concat(customQuestions);
  saveData();

  notify("Question injectée dans la base !");
  document.getElementById("adminQuestionForm").reset();
  populateCategoryFilter();
  displayQuestions();
}

// --- NOTIFICATIONS (file d'attente pour empêcher qu'un toast en écrase un autre) ---

let notifyQueue = [];
let notifyBusy = false;

function queueNotify(msg, duration = 2500) {
  notifyQueue.push({ msg, duration });
  processNotifyQueue();
}

function processNotifyQueue() {
  if (notifyBusy || notifyQueue.length === 0) return;
  notifyBusy = true;
  const { msg, duration } = notifyQueue.shift();
  const box = document.getElementById("notification");
  if (!box) { notifyBusy = false; return; }
  box.textContent = msg;
  box.classList.add("visible");
  setTimeout(() => {
    box.classList.remove("visible");
    setTimeout(() => { notifyBusy = false; processNotifyQueue(); }, 300);
  }, duration);
}

function notify(msg) {
  queueNotify(msg, 2500);
}

// --- ACTIONS DIVERSES ---

document.getElementById("randomQuestion")?.addEventListener("click", () => {
  const q = window.questions[Math.floor(Math.random() * window.questions.length)];
  openQuestion(q);
});

document.getElementById("dailyQuestion")?.addEventListener("click", () => {
  const day = Math.floor(Date.now() / 86400000);
  const q = window.questions[day % window.questions.length];
  openQuestion(q);
});

document.getElementById("exportData")?.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(userData, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "abyssus-save.json";
  a.click();
  URL.revokeObjectURL(url);
  notify("Sauvegarde exportée.");
});

function setupImportExport() {
  const importBtn = document.getElementById("importData");
  const importFile = document.getElementById("importFile");
  if (!importBtn || !importFile) return;

  importBtn.addEventListener("click", () => importFile.click());

  importFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported = JSON.parse(evt.target.result);
        userData = Object.assign({}, DEFAULT_USER_DATA, imported);
        saveData();
        document.getElementById("usernameInput").value = userData.username;
        updateLevelAndTitles();
        displayQuestions();
        notify("Sauvegarde importée !");
      } catch (err) {
        notify("Fichier de sauvegarde invalide.");
      }
    };
    reader.readAsText(file);
    importFile.value = "";
  });
}

document.getElementById("resetData")?.addEventListener("click", () => {
  if (!confirm("Réinitialiser toutes tes données locales ? Cette action est irréversible.")) return;
  localStorage.clear();
  location.reload();
});
