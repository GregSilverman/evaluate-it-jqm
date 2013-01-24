Metro Blooms Garden Evaluation Form
===============================

Current Use: 
----------------
Data capture instrument for garden evaluations by trained volunteers

Platform:
-----------
By hand!

Data Mappings:
-------------------
* Date ->  Evaluation.dateOfEvaluation
* Garden Address -> Site.Address{}
* New nomination -> Ad hoc evaluation; note: n/a for mobile at this time
* Garden no longer exists -> Evaluation.noLongerExists
* Factor -> EvaluationFactorScorecard{}; note: factorType is resolved by lookup to Factor object 
* There is a raingarden/rainbarrel ->  EvaluationFeature{}; featureType is resolved by lookup to Feature object

Process:
-----------
* Record above item
* For Factor, rate each item using scale "Ratings for each factor"
* Sum total ratings
* If sum of total ratings is an Exceptional Garden (>= 18 total points), then you may consider the garden for any award; there are the following stipulations:
1. Best boulevard or Best container garden can be awarded to any garden
2. Only one award can be given to a Garden
3. Use of "Special Garden" must state the type of garden award (e.g., "Best sustainable school produce garden")

Future:
--------
This form is being modified to utlize for rain garden evaluations. The Factors will be slightly modified and there will be more Faetures to choose from.