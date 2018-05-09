# Timelock-Puzzle
POC timelock puzzle 


This proof of concept generates a simple timelock puzzle.

Create timelock governed by N {hash + secrets} pairs in parallel resulting in {hash[n], secret[n]}.

each secret is is dblHashed with HR (Hash Rate).  Check what modern GPU's are hashing at ~ 9-11 Mhs.

Thus, you can compute how long your puzzle will last with HR * N.

hash hash[n] will encrypt seed[n+1]. Thus the parallel operation has now been serialized.

Lock whatever funds with nth hash.

#Advantages

The timelock creator could generate the hashes sporadically until they feel comfortable with the accumualted hash rate.

#Use Case

A rip cord like 

# To Run
terminal #1

node create_timelock


#To decode
terminal #2

node decode_timelock

#Test Results
Test runs showed typically 3.5x decode time vs creation time on CPU hashrates.
