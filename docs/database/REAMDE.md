# Opis modeli

## Model konceptualny

System monitorowania parametrów środowiskowych składa się z kilku kluczowych encji, które wspólnie opisują strukturę danych oraz sposób, w jaki system funkcjonuje.

Pierwszą z encji jest `płytka`, która reprezentuje urządzenie stanowiące fizyczną bazę dla instalacji systemu. Każda płytka ma przypisane unikalne id, dzięki której będzie identyfikowana w systemie. Można nadać jej rónież nazwę. Płytka umożliwia montowanie na niej sensorów, co oznacza, że wiele sensorów może być powiązanych z jedną płytą. Dodatkowo każda płyta musi być przypisana do przynajmniej jednego użytkownika, lecz system umożliwia również przypisanie jednej płyty do wielu użytkowników, co pozwala na współdzielenie urządzeń.

Encja `Sensor` opisuje urządzenia wykonujące pomiary. Każdy sensor jest przypisany do jednej konkretnej płyty i mierzy określony rodzaj wielkości fizycznej, np. temperaturę, wilgotność lub ciśnienie. Relacja między sensorem a płytą ma charakter „wiele do jednego”. Sensor posiada także powiązanie z encją `Rodzaj pomiaru`.

Encja `Rodzaj pomiaru` opisuje typy wielkości fizycznych mierzonych przez sensory, np. temperaturę w `°C` lub wilgotność w `%`. Dzięki tej encji każdy sensor wie, co mierzy, co ułatwia interpretację wyników.

Wyniki pomiarów są zapisywane w encji `Pomiar`, reprezentującej pojedyncze zdarzenie pomiarowe. Zawiera ona wartość liczbową zarejestrowanej wielkości oraz czas wykonania. Każdy pomiar jest powiązany z konkretnym sensorem, co pozwala przypisać wyniki do odpowiedniego urządzenia.

System przewiduje również encję `Użytkownik`, opisującą osoby korzystające z systemu. Użytkownik ma podstawowe dane identyfikacyjne, takie jak id, imię, nazwisko i e-mail, wykorzystywane do logowania. Każdy użytkownik ma dostęp do przypisanych mu płyt. Relacja ta umożliwia użytkownikom przeglądanie danych historycznych, monitorowanie bieżących pomiarów i otrzymywanie informacji o anomaliach, np. nagłych zmianach temperatury.


## Model logiczny

System monitorowania parametrów środowiskowych oparty jest na relacyjnej strukturze bazy danych `PostgreSQL`, która szczegółowo odwzorowuje elementy konceptualne systemu oraz ich powiązania.

Głównym elementem modelu jest tabela `Płytki`, która przechowuje informacje o urządzeniach fizycznych. Każda płytka posiada unikalny identyfikator (`id`) oraz nazwę.

Tabela `Uzytkownicy` przechowuje informacje o osobach korzystających z systemu. Każdy użytkownik jest jednoznacznie identyfikowany za pomocą klucza głównego (`id`) i posiada takie dane, jak imię, nazwisko, adres e-mail i hasło.

Relacja między płytkami a użytkownikami została zrealizowana poprzez tabelę `Uzytkownicy_plytki`, która umożliwia przypisanie wielu użytkowników do jednej płytki oraz odwrotnie. Tabela ta zawiera klucze obce wskazujące na tabele `Uzytkownicy` i `Plytki`.

Tabela `Sensory` opisuje sensory zamontowane na płytkach. Każdy sensor jest przypisany do jednej płytki (`plytka_id`) oraz jednego rodzaju pomiaru (`rodzaj_pomiaru_id`). Informacje o typach mierzonych parametrów środowiskowych przechowywane są w tabeli `Rodzaje_pomiaru`, która zawiera dane dotyczące wielkości fizycznej i jej jednostki.

Pomiary rejestrowane przez sensory są zapisywane w tabeli `Pomiary`. Każdy pomiar jest powiązany z konkretnym sensorem (`sensor_id`) i zawiera informacje o wartości pomiaru (`wartosc`) oraz czasie jego wykonania (`data`). Relacja jeden-do-wielu między tabelami `Sensory` i `Pomiary` pozwala przypisać wiele wyników do jednego urządzenia.

Model logiczny uwzględnia integralność danych poprzez klucze obce. Takie podejście zapewnia nie tylko spójność danych, ale także ułatwia ich analizę i zarządzanie w systemie.
