kill -TERM -$(ps x -o  "%r %c" | grep "gunicorn" | head -n1 | awk '{split($0,array," ")} END{print array[1]}')
