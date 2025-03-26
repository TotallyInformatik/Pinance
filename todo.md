- Implement simple pipeline for uploading banking statements PDF -> PNG -> OCR -> ChatGPT -> Table Display. Use the following prompt as inspiration:

In the following, I will present to you the result of an OCR process reading in a file a user submitted for their finance management which should show a bank statement from a users bank account.


==== start of text ====

Deutsche Kreditbank AG
Herrn Internes Zeichen:
Rui Zhang 180 43 00
Frefherr-vom-Stein-Str. 31
40595 Dusseldorf
5. Mérz 2025
Kontoauszug 3/2025 Seite 1 von 3
Girokonto 1087108690, DE77 1203 0000 1087 1086 90
[Datum [Ersuterung Betrag Soll EUR Betrag Haber EUR)
Kontostand am 04.02.2025, Auszug Nr. 2 2.491,07
06.02.2025|Basislastschrift -3L,35
PayPal Europe S.a.r.l. et Cie S.C.A
1040068143746/PP.4366.PP/. DB Vertr ieb GmbH, Ihr
Einkauf bei DB Vertri eb GmbH AWV-MELDEPFLICHT
BEACHTEN HOTLINE BUNDESBANK: (0800) 1234-111
1040068143746 4LM22256ML76C Glaubiger-ID:
LU96Z770000000000000000058
06.02.2025(Basislastschrift -5,20
PayPal Europe S.a.r.l. et Cie S.C.A
1040084239575/PP.4366.PP/. DB Vertr ieb GmbH, hr
Einkauf bei DB Vertri eb GmbH AWV-MELDEPFLICHT
BEACHTEN HOTLINE BUNDESBANK: (0800) 1234-111
1040084239575 4LM22256ML76C Glaubiger-ID:
LU96Z770000000000000000058
06.02.2025|Basislastschrift -5,20
PayPal Europe S.a.r.l. et Cie S.C.A
1040084645479/PP.4366.PP/. DB Vertrieb GmbH, Ihr
Einkauf bei DB Vertri eb GmbH AWV-MELDEPFLICHT
BEACHTEN HOTLINE BUNDESBANK: (0800) 1234-111
1040084645479 4LM22256ML76C Glaubiger-ID:
LU96Z7Z0000000000000000058
07.02.2025(Kartenzahlung onl -5,99
Spotify/Stockholm/../SE 2025-02-06T05:25 Debitk.00
2099-12 Teillieferung Zahl.System VISA Debit
10.02.2025 Kartenzahlung -98,00
SkiSport.Landhaus/Sautens/../AT 2025-02-08T14:21
Debitk.00 2099-12 Zahl.System VISA Debit
10.02.2025|Kartenzahlung -46,00
Schiregion.Hochoetz/Oetz.Tirol/../AT 2025-02-09T701:48
Debitk.00 2099-12 Zahl.System VISA Debit
10.02.2025 Kartenzahlung -17,80
Panorama.Restaurant/Oetz..Tirol/../ AT 2025-02-09T23:08
Debitk.00 2099-12 Zahl.System VISA Debit
Deutsche Kreditbank AG Vorsitzender des Aufsichtsrats Telefon 030120 300 00 BIC: BYLADEM1001
TaubenstraRe 7 - 9 Stephan Winkelmeier Telefax 030 120 300 01
10117 Berlin Vorstand USt-ID-Nr.: DE137178746
Dr. Sven Deglow (Vorsitzender) info@dkb.de Handelsregister
Ein Unternehmen der Tilo Hacke, Jan Walther, www.dkb.de Berlin-Charlottenburg
Bayerischen Landesbank Arnulf Keese, Kristina Trink (HRB 34165 B)

==== End of Text ====

Your task is the following:
Determine if this text really is the result of an OCR process of a bank statement. 
If not, simply respond with the word "bruh".
If it is, provide me the same information in the text but as a list of json objects of the form:
{
  date: string,
  description: string,
  value: number,
  currency: string,
}
where value is the value either deducted (negative) from the account or the value added (positive) to the account and currency is the currency this account operates on.


