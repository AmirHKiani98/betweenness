k           = int(input())
myPass      = input()
ans         = 0
for x in range(0,k):
    myStr   = input()
    revStr  = myStr[::-1]
    a1      = myStr.find(myPass[x])
    a2      = revStr.find(myPass[x])
    ans    += min(a1,a2+1)
print(ans)