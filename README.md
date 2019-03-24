# Timelock-Puzzle
POC timelock puzzle


This proof of concept generates a simple timelock puzzle.

Create timelock governed by N {hash + secrets} pairs in parallel resulting in {hash[n], secret[n]}.

each secret is is dblHashed with HR (Hash Rate).  Check what modern GPU's are hashing at ~ 9-11 Mhs.

Thus, you can compute how long your puzzle will last with HR * N.

hash hash[n] will encrypt seed[n+1]. Thus the parallel operation has now been serialized.

Lock whatever funds with nth hash.

# Advantages

The timelock creator could generate the hashes sporadically until they feel comfortable with the accumualted hash rate.

# Use Case

The proposed use case is the for the ability of the creator of the timelock to create a contract that automatically transfer funds to another address if hash[n] is presented to it. Presumably this takes HR*N computation time.  The creator then has that much time to either reclaim the funds.  Great for emergency scenarios. 

WARNING: Recall, you cant use this for selective secret releasing on the chain unless you want that secret to be revealed regardless.  

# To Run
terminal #1

node create_timelock


#To decode
terminal #2

node decode_timelock

#Test Results
Test runs showed typically 3.5x decode time vs creation time on CPU hashrates.
